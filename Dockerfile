# Use an official lightweight Python runtime as a base
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Copy all files
COPY . .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Expose port 8080 for Cloud Run
ENV PORT 8080
EXPOSE 8080

# Start the app
CMD ["python", "main.py"]
