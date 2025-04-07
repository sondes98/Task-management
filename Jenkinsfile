pipeline {
    agent any  // Use any available Jenkins agent

    environment {
        DOCKERHUB_USERNAME = "sondes98"  // Docker Hub username
        FRONTEND_REPO = "${DOCKERHUB_USERNAME}/task-management-frontend"  // Docker Hub repo for frontend
        BACKEND_REPO = "${DOCKERHUB_USERNAME}/task-management-backend"  // Docker Hub repo for backend
        FRONTEND_CONTAINER_NAME = "react_frontend_container"  // Frontend container name
        BACKEND_CONTAINER_NAME = "nestjs_backend_container"  // Backend container name
        DOCKERHUB_CREDENTIALS_ID = "dockerhub-creds"  // Jenkins Docker Hub credentials ID
    }

    stages {
        // Frontend pipeline
        stage('Frontend Checkout') {
            steps {
                git 'https://github.com/sondes98/Task-managmenet/tree/main/frontend.git'
            }
        }

        stage('Frontend Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Frontend Lint') {
            steps {
                sh 'npm run lint'
            }
        }

        stage('Frontend Test') {
            steps {
                sh 'npm test'
            }
        }

        stage('Frontend Build') {
            steps {
                sh 'npm run build'
            }
        }

        stage('Frontend Docker Build & Push to Docker Hub') {
            steps {
                script {
                    // Login to Docker Hub
                    withCredentials([usernamePassword(credentialsId: "${DOCKERHUB_CREDENTIALS_ID}", usernameVariable: 'DOCKER_USERNAME', passwordVariable: 'DOCKER_PASSWORD')]) {
                        sh 'echo $DOCKER_PASSWORD | docker login -u $DOCKER_USERNAME --password-stdin'
                    }
                    // Build and push Docker image for frontend
                    sh 'docker build -t $FRONTEND_REPO:latest .'
                    sh 'docker push $FRONTEND_REPO:latest'
                }
            }
        }

        stage('Frontend Deploy') {
            steps {
                sh 'docker stop $FRONTEND_CONTAINER_NAME || true'
                sh 'docker rm $FRONTEND_CONTAINER_NAME || true'
                sh 'docker run -d --name $FRONTEND_CONTAINER_NAME -p 3000:3000 $FRONTEND_REPO:latest'
            }
        }

        // Backend pipeline
        stage('Backend Checkout') {
            steps {
                git 'https://github.com/sondes98/Task-managmenet/tree/main/backend.git'
            }
        }

        stage('Backend Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Backend Lint') {
            steps {
                sh 'npm run lint'
            }
        }

        stage('Backend Test') {
            steps {
                sh 'npm test'
            }
        }

        stage('Backend Build') {
            steps {
                sh 'npm run build'
            }
        }

        stage('Backend Docker Build & Push to Docker Hub') {
            steps {
                script {
                    // Login to Docker Hub
                    withCredentials([usernamePassword(credentialsId: "${DOCKERHUB_CREDENTIALS_ID}", usernameVariable: 'DOCKER_USERNAME', passwordVariable: 'DOCKER_PASSWORD')]) {
                        sh 'echo $DOCKER_PASSWORD | docker login -u $DOCKER_USERNAME --password-stdin'
                    }
                    // Build and push Docker image for backend
                    sh 'docker build -t $BACKEND_REPO:latest .'
                    sh 'docker push $BACKEND_REPO:latest'
                }
            }
        }

        stage('Backend Deploy') {
            steps {
                sh 'docker stop $BACKEND_CONTAINER_NAME || true'
                sh 'docker rm $BACKEND_CONTAINER_NAME || true'
                sh 'docker run -d --name $BACKEND_CONTAINER_NAME -p 5000:5000 $BACKEND_REPO:latest'
            }
        }
    }
}
