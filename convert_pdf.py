from pdf2image import convert_from_path
import os

def convert_pdf_to_images():
    # Create the report directory if it doesn't exist
    if not os.path.exists('assets/report'):
        os.makedirs('assets/report')
    
    # Convert PDF to images
    images = convert_from_path('images/Sample.pdf')
    
    # Save each page as an image
    for i, image in enumerate(images, start=1):
        # Format the filename with leading zeros (e.g., 01, 02, etc.)
        filename = f'assets/report/report-page-{str(i).zfill(2)}.png'
        # Save the image with good quality
        image.save(filename, 'PNG', quality=95)
        print(f'Converted page {i} to {filename}')

if __name__ == '__main__':
    convert_pdf_to_images() 