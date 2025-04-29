document.addEventListener('DOMContentLoaded', function() {
    const postForm = document.getElementById('postForm');
    const imageUpload = document.getElementById('imageUpload');
    const imageInput = document.getElementById('imageInput');
    const clearBtn = document.getElementById('clearBtn');

    // Handle image upload
    imageUpload.addEventListener('click', function() {
        imageInput.click();
    });

    imageInput.addEventListener('change', function(e) {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = function(e) {
                imageUpload.style.backgroundImage = `url(${e.target.result})`;
                imageUpload.style.backgroundSize = 'cover';
                imageUpload.style.backgroundPosition = 'center';
                const placeholder = imageUpload.querySelector('.upload-placeholder');
                if (placeholder) placeholder.style.display = 'none';
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    });

    // Handle clear button
    clearBtn.addEventListener('click', function() {
        postForm.reset();
        imageUpload.style.backgroundImage = 'none';
        const placeholder = imageUpload.querySelector('.upload-placeholder');
        if (placeholder) placeholder.style.display = 'flex';
    });

    // Remove the preventDefault from form submission
    postForm.addEventListener('submit', function(e) {
        // Don't prevent the default form submission
        // Let the form submit naturally to the server
    });
});

// Initialize Quill editor
var quill = new Quill('#editor', {
    theme: 'snow',
    modules: {
        toolbar: [
            ['bold', 'italic', 'underline', 'strike'],
            ['blockquote', 'code-block'],
            [{ 'header': 1 }, { 'header': 2 }],
            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
            [{ 'script': 'sub'}, { 'script': 'super' }],
            [{ 'indent': '-1'}, { 'indent': '+1' }],
            ['link', 'image'],
            ['clean']
        ]
    }
});

// Image upload handling
const dropZone = document.getElementById('dropZone');
const fileInput = document.getElementById('imageInput');
const uploadBtn = document.getElementById('uploadBtn');
const imagePreview = document.getElementById('imagePreview');
const previewImg = document.getElementById('previewImg');
const removeBtn = document.getElementById('removeImage');
const uploadPlaceholder = document.querySelector('.upload-placeholder');

// Handle drag and drop
['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    dropZone.addEventListener(eventName, preventDefaults, false);
});

function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
}

['dragenter', 'dragover'].forEach(eventName => {
    dropZone.addEventListener(eventName, highlight, false);
});

['dragleave', 'drop'].forEach(eventName => {
    dropZone.addEventListener(eventName, unhighlight, false);
});

function highlight() {
    dropZone.classList.add('dragover');
}

function unhighlight() {
    dropZone.classList.remove('dragover');
}

// Handle dropped files
dropZone.addEventListener('drop', handleDrop, false);

function handleDrop(e) {
    const dt = e.dataTransfer;
    const files = dt.files;
    handleFiles(files);
}

// Handle file selection
uploadBtn.addEventListener('click', () => fileInput.click());
fileInput.addEventListener('change', () => handleFiles(fileInput.files));

function handleFiles(files) {
    if (files.length > 0) {
        const file = files[0];
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = function(e) {
                previewImg.src = e.target.result;
                imagePreview.style.display = 'block';
                uploadPlaceholder.style.display = 'none';
            };
            reader.readAsDataURL(file);
        }
    }
}

// Remove image
removeBtn.addEventListener('click', () => {
    fileInput.value = '';
    imagePreview.style.display = 'none';
    uploadPlaceholder.style.display = 'flex';
});

// Form submission
document.getElementById('postForm').addEventListener('submit', function(e) {
    document.getElementById('blogContent').value = quill.root.innerHTML;
});

// Clear form
document.getElementById('clearBtn').addEventListener('click', function() {
    this.form.reset();
    quill.setContents([]);
    fileInput.value = '';
    imagePreview.style.display = 'none';
    uploadPlaceholder.style.display = 'flex';
});