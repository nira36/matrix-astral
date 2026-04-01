import os

def fix_file(path):
    try:
        with open(path, 'rb') as f:
            content = f.read()
        
        # Replace non-printable ASCII or invalid characters with spaces/reasonable defaults
        # Most of these 'glitches' are in the 128+ range or null bytes
        # We'll just try to decode it safely and skip errors
        clean_content = content.decode('utf-8', errors='ignore')
        
        # Specifically target the characters that were shown in previous outputs
        # like the placeholder characters
        clean_content = clean_content.replace('\ufffd', ' ')
        
        with open(path, 'w', encoding='utf-8') as f:
            f.write(clean_content)
        print(f"Fixed {path}")
    except Exception as e:
        print(f"Error fixing {path}: {e}")

files_to_fix = [
    r'c:\Users\stets\numerology-app\app\page.tsx',
    r'c:\Users\stets\numerology-app\components\EsotericMatrix.tsx',
    r'c:\Users\stets\numerology-app\app\esoteric-matrix\page.tsx',
    r'c:\Users\stets\numerology-app\components\NumberCard.tsx',
    r'c:\Users\stets\numerology-app\components\ChakraDisplay.tsx'
]

for f in files_to_fix:
    if os.path.exists(f):
        fix_file(f)
