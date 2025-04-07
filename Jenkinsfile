pipeline {
    agent any

    environment {
        DOCKERHUB_USERNAME = "sondes98"
        FRONTEND_REPO = "${DOCKERHUB_USERNAME}/task-management-frontend"
        BACKEND_REPO = "${DOCKERHUB_USERNAME}/task-management-backend"
        DOCKERHUB_CREDENTIALS_ID = "dockerhub-creds"
    }

    stages {
        stage('Checkout Code') {
            steps {
                git url: 'https://github.com/sondes98/Task-managmenet.git', branch: 'main'
            }
        }

        stage('Install Frontend Dependencies') {
            steps {
                dir('frontend') {
                    sh 'npm install'
                }
            }
        }

        stage('Lint & Test Frontend') {
            steps {
                dir('frontend') {
                    sh 'npm run lint || true'
                    sh 'npm test || true'
                }
            }
        }

        stage('Install Backend Dependencies') {
            steps {
                dir('backend') {
                    sh 'npm install'
                }
            }
        }

        stage('Lint & Test Backend') {
            steps {
                dir('backend') {
                    sh 'npm run lint || true'
                    sh 'npm test || true'
                }
            }
        }

        stage('Build & Push Docker Images') {
            steps {
                script {
                    withCredentials([usernamePassword(credentialsId: "${DOCKERHUB_CREDENTIALS_ID}", usernameVariable: 'DOCKER_USERNAME', passwordVariable: 'DOCKER_PASSWORD')]) {
                        sh 'echo $DOCKER_PASSWORD | docker login -u $DOCKER_USERNAME --password-stdin'
                    }

                    // Build & tag frontend
                    sh 'docker build -t $FRONTEND_REPO:latest ./frontend'
                    sh 'docker push $FRONTEND_REPO:latest'

                    // Build & tag backend
                    sh 'docker build -t $BACKEND_REPO:latest ./backend'
                    sh 'docker push $BACKEND_REPO:latest'
                }
            }
        }

        stage('Deploy with Docker Compose') {
            steps {
                // Stop existing containers if running
                sh 'docker-compose down || true'

                // Deploy new containers
                sh 'docker-compose up -d --build'
            }
        }
    }

    post {
        always {
            echo 'Pipeline finished.'
        }
        failure {
            echo 'Pipeline failed 😢'
        }
        success {
            echo 'Pipeline succeeded 🎉'
        }
    }
}
