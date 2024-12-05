import argparse
from pathlib import Path
import importlib
import base64
import tempfile
import os

from sparql import get_frames_of_video_segment, get_cameras, get_object_containing_frames, get_video
import cv2


def main():
    args = get_args()

    action: str = args.action
    main_object: str = args.__getattribute__('main-object')
    target_object: str | None = args.target_object
    camera: str | None = args.camera
    is_full: bool = args.full
    is_segment: bool = args.segment
    output_path: str = args.__getattribute__('output-path')

    absolute_output_path = str(Path(output_path).resolve())

    if is_segment:
        output_video_segment(action, main_object, target_object, camera, absolute_output_path)
    if is_full:
        output_full_video(action, main_object, target_object, camera, absolute_output_path)

    output_object_containing_image(action, main_object, target_object, camera, absolute_output_path)


def get_args():
    parser = argparse.ArgumentParser(
        prog='action_object_search',
        description='A tool to search for data(videos, images, coordinates of bounding boxes) which contains a specific action and objects in the RDF database'
    )

    parser.add_argument("action", type=str, help="The action to search for (exact matching)")
    parser.add_argument("main-object", type=str, help="The main object of an event (partially matching)")
    parser.add_argument("-t", "--target-object", type=str, help="The target object of an event (partially matching)")
    parser.add_argument("-c",  "--camera",  type=str, help="The camera number to search for (optional)")
    parser.add_argument("-f", "--full", action='store_true', help="The flag to search for videos")
    parser.add_argument("-s", "--segment", action='store_true', help="The flag to search for the segments of the videos")
    parser.add_argument("output-path", type=str, help="The directory to save the search results (can be relative or absolute)")

    return parser.parse_args()


def output_full_video(action: str, main_object: str, target_object: str | None, camera: str | None, absolute_output_path: str):
    output_video = importlib.import_module('mmkg-search').output_video
    camera_list = get_cameras(action, main_object, target_object, camera)
    frame_list = {'all': {'start_frame': None, 'end_frame': None}}
    for camera in camera_list:
        [*activity_name_word_list, scene, camera] = camera.split('_')
        activity = '_'.join(activity_name_word_list)
        output_video(activity, scene, camera, frame_list,absolute_output_path)


def output_video_segment(action: str, main_object: str, target_object: str | None, camera: str | None, absolute_output_path: str):
    output_video = importlib.import_module('mmkg-search').output_video
    frames = get_frames_of_video_segment(action, main_object, target_object, camera)
    for video_segment_name in frames.keys():
        split_video_segment_name = video_segment_name.split('_') # ['clean', 'sink3', '1', 'scene7', 'video', 'segment10']
        (*activity_name_word_list, camera_number, scene, _, _) = split_video_segment_name
        activity = '_'.join(activity_name_word_list)

        output_video(activity, scene, "camera" + camera_number, {video_segment_name: frames[video_segment_name]}, absolute_output_path)


def output_object_containing_image(action: str, main_object: str, target_object: str | None, camera: str | None, absolute_output_path: str):
    video_segment_names = get_frames_of_video_segment(action, main_object, target_object, camera).keys()
    for video_segment_name in video_segment_names:
        with TemporaryVideoFile(video_segment_name) as tmp_video:
            if tmp_video is None:
                continue
            frame_lists = get_object_containing_frames(video_segment_name, main_object, target_object)
            for frame_list in frame_lists:
                output_image_from_video(tmp_video.name, frame_list, absolute_output_path)


def output_image_from_video(video_path, frame_list, absolute_output_path):
    image_directory_path = absolute_output_path + "/images"
    if not os.path.exists(image_directory_path):
        os.makedirs(image_directory_path)

    cap = cv2.VideoCapture(video_path)
    if not cap.isOpened():
        print("Cannot open video")
        return

    for video_segment_name in frame_list:
        if video_segment_name == 'all':
            continue

        start_frame = frame_count = frame_list[video_segment_name]['start_frame']
        end_frame = frame_list[video_segment_name]['end_frame']
        frame_gap = 5

        cap.set(cv2.CAP_PROP_POS_FRAMES, from_14_5_to_30_fps(start_frame))
        
        while True:
            if frame_count > end_frame:
                break
            success, image = cap.read()
            if not success:
                break

            frame_path = image_directory_path + "/" + video_segment_name + "_frame" + str(frame_count).zfill(4) + ".jpg"
            cv2.imwrite(frame_path, image)
            print("Image saved to " + frame_path)
            
            frame_count += frame_gap
            cap.set(cv2.CAP_PROP_POS_FRAMES, from_14_5_to_30_fps(frame_count))

    cap.release()


def from_14_5_to_30_fps(frame_number):
    return int(frame_number / 14.5 * 30)


class TemporaryVideoFile:
    def __init__(self, video_segment_name: str):
        (*activity_name_word_list, camera_number, scene, _, _) = video_segment_name.split('_')
        activity = '_'.join(activity_name_word_list)

        results = get_video(activity, scene, "camera" + camera_number)

        bindings = results["results"]["bindings"]
        if len(bindings) == 0:
            print("No video found")
            self.tmp_file = None

        result = bindings[0]
        video_base64 = result["video"]["value"]
        video_binary = base64.b64decode(video_base64)

        self.tmp_file = tempfile.NamedTemporaryFile(suffix=".mp4")
        self.tmp_file.write(video_binary)

    def __enter__(self):
        return self.tmp_file

    def __exit__(self, *args):
        self.tmp_file.close()


if __name__ == '__main__':
    main()
