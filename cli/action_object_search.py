import argparse
from pathlib import Path
import importlib

from sparql import get_frames_for_video_segment, get_cameras


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
    else:
        output_full_video(action, main_object, target_object, camera, absolute_output_path)


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


if __name__ == '__main__':
    main()
