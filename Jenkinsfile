pipeline {
    agent { label 'build-agent' }

    environment {
        REPO_URL    = 'https://github.com/likeweb3125/namuem.git'
        APP_DIR     = '/home/namuem/'
        DEPLOY_HOST = '112.175.29.134'
        DEPLOY_USER = 'root'
        // 빌드 에이전트에 설정된 SSH 키(~/.ssh 등)로 134 서버 접속. Jenkins 자격증명 불필요.
        RECIPIENTS  = 'ohsjwe@likeweb.co.kr,sol7721@likeweb.co.kr,crazin@likeweb.co.kr'
        // RECIPIENTS = 'crazin@likeweb.co.kr'
    }

    stages {
        stage('Extract Git Info') {
            steps {
                script {
                    // 브랜치명
                    env.GIT_BRANCH = sh(script: "git rev-parse --abbrev-ref HEAD", returnStdout: true).trim()
                    env.GIT_BRANCHSTRIP = env.GIT_BRANCH
                        .replaceFirst(/^origin\//, '')
                        .replaceFirst(/^refs\\/heads\\//, '')   

                    // 최신 커밋 정보.
                    env.GIT_COMMIT_HASH    = sh(script: "git rev-parse HEAD", returnStdout: true).trim()
                    env.GIT_COMMIT_AUTHOR  = sh(script: "git log -1 --pretty=format:'%an'", returnStdout: true).trim()
                    env.GIT_COMMIT_EMAIL   = sh(script: "git log -1 --pretty=format:'%ae'", returnStdout: true).trim()
                    env.GIT_COMMIT_MESSAGE = sh(script: "git log -1 --pretty=format:'%s'", returnStdout: true).trim()
                    env.GIT_COMMIT_TIME    = sh(script: "git log -1 --pretty=format:'%cd' --date=format:'%Y-%m-%d %H:%M:%S'", returnStdout: true).trim()

                    echo "🔎 브랜치: ${env.GIT_BRANCHSTRIP}"
                    echo "🔎 커밋: ${env.GIT_COMMIT_HASH}"
                    echo "🔎 작성자: ${env.GIT_COMMIT_AUTHOR} <${env.GIT_COMMIT_EMAIL}>"
                    echo "🔎 메시지: ${env.GIT_COMMIT_MESSAGE}"
                    echo "🔎 시간: ${env.GIT_COMMIT_TIME}"
                }
            }
        }

        stage('Deploy') {
            steps {
                script {
                    deployVersion()
                }
            }
        }
    }

    post {
        success {
            sendMailOnSuccess()
        }
        failure {
            sendMailOnFailure("❌ 파이프라인 실패")
        }
        always {
            echo "🧹 사용하지 않는 Docker 볼륨 정리 중..."
            sh 'docker volume prune -f'
        }
    }
}

// ===== Functions =====

// 배포 함수 (배포 서버 112.175.29.134 에 SSH 후 실행)
def deployVersion() {
    def path = "${env.APP_DIR}"
    def host = "${env.DEPLOY_HOST}"
    def user = "${env.DEPLOY_USER}"
    def branch = "${env.GIT_BRANCHSTRIP}"

    echo "🚀 배포 시작 (${user}@${host}:${path})"

    // 빌드 에이전트의 기본 SSH 키로 134 접속 (sshagent/자격증명 없음)
    sh """
        ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null ${user}@${host} "set -e
            cd ${path}
            git fetch origin
            git reset --hard origin/${branch}
            git clean -fd
            git pull origin ${branch}

            echo '🛠 .env 파일에서 환경변수 로드 중...'
            export \\\$(grep -v '^#' .env | sed 's/#.*//' | xargs)

            echo '📦 Docker Compose 실행 중...'
            docker compose -f docker-compose.yml down
            docker compose -f docker-compose.yml build --pull
            docker compose -f docker-compose.yml up -d
        "
    """

    echo "✅ 배포 완료"
}


// 실패 시 메일
def sendMailOnFailure(message) {
    emailext (
        subject: "🔴 빌드 실패: ${env.JOB_NAME} #${env.BUILD_NUMBER} (${env.GIT_BRANCHSTRIP})",
        body: """
        <h2>❌ Jenkins 빌드 실패</h2>
        <p>브랜치: ${env.GIT_BRANCHSTRIP}</p>
        <p>에러 메시지: ${message}</p>
        <p><a href="${env.BUILD_URL}console">로그 보기</a></p>
        """,
        to: "${env.RECIPIENTS}",
        from: "no-reply@likeweb.co.kr"
    )
}

// 성공 시 메일
def sendMailOnSuccess() {
    emailext (
        subject: "✅ 빌드 성공: ${env.JOB_NAME} #${env.BUILD_NUMBER} (${env.GIT_BRANCHSTRIP})",
        body: """
        <h2>🎉 Jenkins 빌드 성공 </h2>
        <p>브랜치: ${env.GIT_BRANCHSTRIP}</p>
        <p><a href="${env.BUILD_URL}console">로그 보기</a></p>
        """,
        to: "${env.RECIPIENTS}",
        from: "no-reply@likeweb.co.kr"
    )
}
