import os

def generate_directory_tree(root_dir, output_file, max_depth=4):
    with open(output_file, 'w') as f:
        for dirpath, dirnames, filenames in os.walk(root_dir):
            # ディレクトリの深さを計算
            depth = dirpath.replace(root_dir, '').count(os.sep)
            if depth >= max_depth:
                continue
            indent = ' ' * 4 * depth
            f.write(f'{indent}{os.path.basename(dirpath)}/\n')
            subindent = ' ' * 4 * (depth + 1)
            for filename in filenames:
                f.write(f'{subindent}{filename}\n')

# 使用例: 現在のディレクトリで4階層までのフォルダ構造を出力
generate_directory_tree('.', 'directory_structure.txt', max_depth=4)
