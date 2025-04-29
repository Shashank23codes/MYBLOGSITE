from flask import Flask, render_template, request
from werkzeug.utils import secure_filename
import os
from datetime import datetime
# for connect to mongodb
from pymongo import MongoClient
from bson import ObjectId  # Add this import at the top with other imports

app = Flask(__name__)

# app.config["MONGO_URI"] = "mongodb://localhost:27017/myDatabase"
# mongo = PyMongo(app)
client = MongoClient("mongodb://localhost:27017")
db = client["Mybolg"]
collection = db["posts"]

# Configure upload folder
app.config['UPLOAD_FOLDER'] = 'static/uploads'
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size

# Ensure upload folder exists
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

# Home page
@app.route('/')
def home():
    return render_template('index.html')

# Blog page
@app.route('/blogs')
def blogs():
    # Fetch all posts from MongoDB
    posts = list(collection.find())
    return render_template('blogs.html', posts=posts)

# blog details page
@app.route('/blogs/<post_id>')
def blog_details(post_id):
    post = collection.find_one({"_id": ObjectId(post_id)})
    return render_template('blog_details.html', post=post)

# Genre page
@app.route('/genres')
def genres():
    return render_template('genres.html')

# About page
@app.route('/about')
def about():
    return render_template('about.html')

# Add Post page
@app.route('/addPost', methods=['GET', 'POST'])
def addPost():
    if request.method == 'POST':
        try:
            # Get form data
            title = request.form.get('title')
            author = request.form.get('author')
            category = request.form.get('category')
            content = request.form.get('content')
            tags = request.form.get('tags', '').split(',') if request.form.get('tags') else []
            
            # Initialize image_path as None
            image_path = None
            
            # Handle image upload
            if 'featured_image' in request.files:
                image = request.files['featured_image']
                if image.filename != '':
                    # Secure the filename
                    filename = secure_filename(image.filename)
                    # Save the file with full path
                    full_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
                    image.save(full_path)
                    # Store only the relative path in database (after 'static/')
                    image_path = 'uploads/' + filename
                    print(f'Image saved at: {image_path}')
            
            # Create a formatted post data dictionary
            post_data = {
                'title': title,
                'author': author,
                'category': category,
                'content': content,
                'tags': tags,
                'featured_image': image_path,
                'created_at': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
            }
            # Insert the post data into MongoDB
            collection.insert_one(post_data)
            
            # Print the formatted data
            print('\n=== New Blog Post Received ===')
            print(f'Title: {post_data["title"]}')
            print(f'Author: {post_data["author"]}')
            print(f'Category: {post_data["category"]}')
            print(f'Content : ({post_data["content"]}')
            print(f'Content Length: {len(post_data["content"])} characters')
            print(f'Tags: {", ".join(post_data["tags"]) if post_data["tags"] else "No tags"}')
            print(f'Featured Image: {"Yes" if post_data["featured_image"] else "No"}')
            print(f'Created At: {post_data["created_at"]}')
            print('============================\n')
            
        except Exception as e:
            print(f'Error processing form data: {str(e)}')
            
    return render_template('addPost.html')




app.run(debug=True)