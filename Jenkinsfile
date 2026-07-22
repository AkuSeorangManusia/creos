pipeline {
    agent any

    environment {
        DEPLOY_HOST = '192.168.18.15'
        DEPLOY_USER = 'root'
        REPO_URL    = 'https://github.com/AkuSeorangManusia/creos.git'
        APP_DIR     = '/opt/jenkins/andimsum-portfolio'
    }

    stages {
        stage('Add Host Key') {
            steps {
                sh "ssh-keyscan -H ${DEPLOY_HOST} >> ~/.ssh/known_hosts 2>/dev/null || true"
            }
        }

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
                            npm ci
                            npm run build
                            cp -n .env.production .env.local 2>/dev/null || true
                            pm2 startOrReload ecosystem.config.js --update-env
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
