import argparse
from pathlib import Path


def main():
    args = get_args()

    action: str = args.action
    main_object: str = args.__getattribute__('main-object')
    target_object: str = args.target_object
    camera: str = args.camera
    is_full: bool = args.full
    is_segment: bool = args.segment
    output_path: str = args.__getattribute__('output-path')

    absolute_output_path = Path(output_path).resolve()

    print(main_object, target_object, camera, is_full, is_segment, absolute_output_path)

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

if __name__ == '__main__':
    main()
