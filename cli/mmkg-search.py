def main():
    import os

    args = parse_args()

    output_path = args.output_path + "/" + args.activity + "_" + args.scene + "_" + args.camera
    if not os.path.exists(output_path):
        os.makedirs(output_path)

    frame_list = get_frames(args.activity, args.scene, args.camera, args.start, args.end, args.action, args.object)
    output_video(args.activity, args.scene, args.camera, frame_list, output_path)
    output_image(frame_list, output_path)
    output_annotation(args.activity, args.scene, args.camera, frame_list, output_path)


def parse_args():
    import argparse

    parser = argparse.ArgumentParser(description='Search for a database in the MMKG dataset')
    parser.add_argument('activity', type=str, help='The activity to search for')
    parser.add_argument('scene', type=str, help='The scene to search for')
    parser.add_argument('camera', type=str, help='The camera to search for')
    parser.add_argument('-a', '--action', type=str, help='The event action to search for')
    parser.add_argument('-o', '--object', type=str, help='The object to search for')
    parser.add_argument('-s', '--start', type=int, help='The start frame of the video')
    parser.add_argument('-e', '--end', type=int, help='The end frame of the video')
    parser.add_argument('output_path', type=str, help='The path to save the output')

    return parser.parse_args()


def get_frames(activity, scene, camera, start_frame, end_frame, action, object):
    print("Searching for frames...")
    import sparql
    frame_list = {}
    segments = None

    if object is not None:
        segments = sparql.get_frames_from_object(activity, scene, camera, action, object)
    elif action is not None:
        segments = sparql.get_frames_from_action(activity, scene, camera, action)
    else:
        segments = sparql.get_all_frames(activity, scene, camera)
        frame_list['all'] = {'start_frame': start_frame, 'end_frame': end_frame}

    for segment in segments:
        segment_start_frame = segments[segment]['start_frame']
        segment_end_frame = segments[segment]['end_frame']
        if start_frame is None and end_frame is None:
            frame_list[segment] = {'start_frame': segment_start_frame, 'end_frame': segment_end_frame}
        elif end_frame is None:
            if segment_end_frame < start_frame:
                continue
            elif segment_start_frame < start_frame:
                frame_list[segment] = {'start_frame': start_frame, 'end_frame': segment_end_frame}
            else:
                frame_list[segment] = {'start_frame': segment_start_frame, 'end_frame': segment_end_frame}
        elif start_frame is None:
            if end_frame < segment_start_frame:
                continue
            elif end_frame < segment_end_frame:
                frame_list[segment] = {'start_frame': segment_start_frame, 'end_frame': end_frame}
            else:
                frame_list[segment] = {'start_frame': segment_start_frame, 'end_frame': segment_end_frame}
        else:
            if segment_end_frame < start_frame or end_frame < segment_start_frame:
                continue
            elif segment_start_frame < start_frame and segment_end_frame <= end_frame:
                frame_list[segment] = {'start_frame': start_frame, 'end_frame': segment_end_frame}
            elif start_frame <= segment_start_frame and end_frame < segment_end_frame:
                frame_list[segment] = {'start_frame': segment_start_frame, 'end_frame': end_frame}
            elif start_frame <= segment_start_frame and segment_end_frame <= end_frame:
                frame_list[segment] = {'start_frame': segment_start_frame, 'end_frame': segment_end_frame}
            else:
                frame_list[segment] = {'start_frame': start_frame, 'end_frame': end_frame}

    return frame_list


def output_video(activity, scene, camera, frame_list, output_path):
    print("Outputting video...")
    import os
    import base64
    import tempfile
    import sparql

    video_directory = output_path + "/videos"
    if not os.path.exists(video_directory):
        os.makedirs(video_directory)

    results = sparql.get_video(activity, scene, camera)

    bindings = results["results"]["bindings"]
    if bindings.__len__() == 0:
        print("No video found")
        return

    result = bindings[0]
    frame_rate = result["frame_rate"]["value"]
    video_base64 = result["video"]["value"]
    video_binary = base64.b64decode(video_base64)
    if 'all' in frame_list:
        if frame_list['all']['start_frame'] is None and frame_list['all']['end_frame'] is None:
            video_path = video_directory + "/" + activity + "_" + scene + "_" + camera + ".mp4"
            with open(video_path, "wb") as file:
                file.write(video_binary)
                print("Video saved to " + video_path)
        else:
            video_path = video_directory + "/" + activity + "_" + scene + "_" + camera + "_trimmed.mp4"
            with tempfile.NamedTemporaryFile(suffix=".mp4") as tmp_file:
                tmp_file.write(video_binary)
                tmp_path = tmp_file.name
                trim_video(tmp_path, video_path, frame_rate, frame_list['all']['start_frame'], frame_list['all']['end_frame'])
    else:
        with tempfile.NamedTemporaryFile(suffix=".mp4") as tmp_file:
            tmp_file.write(video_binary)
            tmp_path = tmp_file.name
            for segment in frame_list:
                video_path = video_directory + "/" + segment + ".mp4"
                start_frame = frame_list[segment]['start_frame']
                end_frame = frame_list[segment]['end_frame']
                trim_video(tmp_path, video_path, frame_rate, start_frame, end_frame)


def trim_video(tmp_path, video_path, frame_rate, start_frame, end_frame):
    print("Trimming video...")
    import ffmpeg

    if start_frame is None and end_frame is None:
        ffmpeg.input(tmp_path).output(video_path).run()
    elif start_frame is None:
        end_seconds = float(end_frame)/float(frame_rate)
        ffmpeg.input(tmp_path, ss=0, to=end_seconds).output(video_path).run()
    elif end_frame is None:
        start_seconds = float(start_frame)/float(frame_rate)
        ffmpeg.input(tmp_path, ss=start_seconds).output(video_path).run()
    else:
        if start_frame == end_frame:
            print("ERROR: Cannot trim video to a single frame.")
            return
        start_seconds = float(start_frame)/float(frame_rate)
        end_seconds = float(end_frame)/float(frame_rate)
        ffmpeg.input(tmp_path, ss=start_seconds, to=end_seconds).output(video_path).run()

    print("Video saved to " + video_path)


def output_image(frame_list, output_path):
    print("Outputting images...")
    import os
    import cv2
    import sparql

    image_directory = output_path + "/images"
    if not os.path.exists(image_directory):
        os.makedirs(image_directory)

    for segment in frame_list:
        print("Outputting images for " + segment + "...")
        if segment == 'all':
            continue
        image_dict = sparql.get_images(segment, frame_list[segment]['start_frame'], frame_list[segment]['end_frame'])

        for descriptor in image_dict:
            print("Saving images for " + descriptor + "...")
            images = list(image_dict[descriptor]['images'].values())
            split_width = image_dict[descriptor]['split_width']

            horizontal_list = []
            for i in range(0, len(images), split_width):
                horizontal_list.append(cv2.hconcat(images[i:i+split_width]))

            combined_horizontal = cv2.vconcat(horizontal_list)

            cv2.imwrite(image_directory + "/" + descriptor + ".jpg", combined_horizontal)
            print("Image saved to " + image_directory + "/" + descriptor + ".jpg")


def output_annotation(activity, scene, camera, frame_list, output_path):
    print("Outputting annotation...")
    import os
    import sparql

    annotation_directory = output_path + "/annotations"
    if not os.path.exists(annotation_directory):
        os.makedirs(annotation_directory)

    annotation_list = sparql.get_annotation_2d_bbox(scene, frame_list)
    with open(annotation_directory + "/" + activity + "_" + scene + "_" + camera + "_2D.tsv", "w") as file:
        for annotation in annotation_list:
            file.write(annotation['frame_number'] + "\t" + annotation['object'] + "\t" + annotation['2dbbox'] + "\n")
    print("Annotation saved to " + annotation_directory + "/" + activity + "_" + scene + "_" + camera + "_2D.tsv")

    annotation_list = sparql.get_annotation_action(scene, frame_list)
    with open(annotation_directory + "/" + activity + "_" + scene + "_" + camera + "_Action.tsv", "w") as file:
        for annotation in annotation_list:
            file.write(annotation['action'] + "\t" + annotation['main_object'] + "\t" + annotation['target_object'] + "\t" + str(annotation['start_frame']) + "\t" + str(annotation['end_frame']) + "\n")
    print("Annotation saved to " + annotation_directory + "/" + activity + "_" + scene + "_" + camera + "_Action.tsv")


if __name__ == "__main__":
    main()
