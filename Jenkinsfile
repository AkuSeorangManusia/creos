pipeline {
    agent any

    environment {
        DEPLOY_HOST = '192.168.18.8'
        DEPLOY_USER = 'root'
        REPO_URL    = 'https://github.com/AkuSeorangManusia/creos.git'
        APP_DIR     = '/opt/jenkins/andimsum-portfolio'
        NODE_VERSION    = '26.5.0'
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
                            /root/.nvm/versions/node/v${NODE_VERSION}/bin/npm ci
                            /root/.nvm/versions/node/v${NODE_VERSION}/bin/npm run build
                            cp -n .env.production .env.local 2>/dev/null || true
                            /root/.nvm/versions/node/v${NODE_VERSION}/bin/pm2 startOrReload ecosystem.config.js --update-env
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
