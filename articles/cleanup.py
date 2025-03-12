import os
import glob
import shutil

def cleanup_generated_files():
    """Remove all JSON files created by the parser in chapter_* directories"""
    current_dir = os.path.dirname(os.path.abspath(__file__))
    
    # Find all chapter directories created by the parser
    chapter_pattern = os.path.join(current_dir, "chapter_*")
    chapter_dirs = glob.glob(chapter_pattern)
    
    if not chapter_dirs:
        print("No chapter directories found to clean up.")
        return
    
    print(f"Found {len(chapter_dirs)} chapter directories to clean up:")
    for dir_path in chapter_dirs:
        print(f"  - {os.path.basename(dir_path)}")
    
    confirm = input("\nAre you sure you want to delete all these directories and their contents? (y/n): ")
    if confirm.lower() != 'y':
        print("Cleanup cancelled.")
        return
    
    # Delete all chapter directories
    for dir_path in chapter_dirs:
        try:
            shutil.rmtree(dir_path)
            print(f"Deleted: {dir_path}")
        except Exception as e:
            print(f"Error deleting {dir_path}: {e}")
    
    print("\nCleanup completed. All generated files have been removed.")

if __name__ == "__main__":
    cleanup_generated_files() 