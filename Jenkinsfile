pipeline {
    agent any

    environment {
        IMAGE_NAME   = 'andimsum-portfolio'
        CONTAINER    = 'andimsum-portfolio'
        DEPLOY_HOST  = '192.168.18.8'
        DEPLOY_USER  = 'root'
        REPO_URL     = 'https://github.com/AkuSeorangManusia/creos.git'
        APP_DIR      = "/opt/jenkins/andimsum-portfolio"
    }

    stages {
        stage('Deploy via SSH') {
            steps {
                sshagent(['deploy-server-key']) {
                    sh """
                        ssh ${DEPLOY_USER}@${DEPLOY_HOST} '
                            set -e
                            if [ ! -d ${APP_DIR} ]; then
                                git clone ${REPO_URL} ${APP_DIR}
                            fi
                            cd ${APP_DIR}
                            git pull origin main
                            docker build -t ${IMAGE_NAME}:latest .
                            docker stop ${CONTAINER} 2>/dev/null || true
                            docker rm ${CONTAINER} 2>/dev/null || true
                            docker run -d \
                              --name ${CONTAINER} \
                              -p 3000:3000 \
                              --restart unless-stopped \
                              --env-file .env.production \
                              ${IMAGE_NAME}:latest
                        '
                    """
                }
            }
        }
    }

    post {
        success { echo 'Deployment successful!' }
        failure { echo 'Pipeline failed.' }
    }
}
