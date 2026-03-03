pipeline {
    agent { label 'build-agent' }

    environment {
        REPO_URL = 'https://github.com/likeweb3125/basic_solution.git'
        REMOTE_HOST   = 'root@112.175.29.146'       // 메인
        REMOTE_HOST2  = 'root@112.175.29.146'      // 개발
        APP_DIR = '/home/likeweb/basic_solution_web'
        MAIN_DOMAIN = 'basic.likeweb.co.kr'
        DEVELOP_DOMAIN = 'basic.likeweb.co.kr'
        JENKINS_HOST = 'root@112.175.29.146'
        JENKINS_HOST2 = 'root@218.232.94.81' // 내부아이피
        SERVER_ALIAS = 'BASIC_WEB_NON_STOP'
        RECIPIENTS = 'ohsjwe@likeweb.co.kr,shan@likeweb.co.kr,sol7721@likeweb.co.kr'
    }
    stages {
        stage('Extract Branch Info') {
            steps {
                script {
                    // 다중 fallback을 통해 브랜치명 안정적으로 추출..
                    env.GIT_BRANCH = env.GIT_BRANCH ?: env.CHANGE_BRANCH ?: env.BRANCH_NAME ?: sh(
                        script: "git rev-parse --abbrev-ref HEAD",
                        returnStdout: true
                    ).trim()

                    // origin/ 접두사 제거
                    env.GIT_BRANCHSTRIP = env.GIT_BRANCH
                    .replaceFirst(/^origin\//, '')
                    .replaceFirst(/^refs\/heads\//, '')

                    echo "🔎 감지된 브랜치명: ${env.GIT_BRANCHSTRIP}"
                }
            }
        }

        stage('Check Branch') {
            steps {
                script {
                    def branchName = env.GIT_BRANCHSTRIP

                    if (branchName == 'develop') {
                        // deployBranch(env.REMOTE_HOST2, branchName)
                    } else if (branchName == 'main') {
                        deployBranch(env.REMOTE_HOST, branchName)
                    } else {
                        error "❌ 지원되지 않는 브랜치입니다: ${branchName}"
                    }
                }
            }
        }
    }

    post {
        success {
            sendMailOnSuccess()
        }
        failure {
            sendMailOnFailure("파이프라인 실패")
        }
    }
}

def deployBranch(remote, branchName) {
    echo "🛠 Branch 배포 로직 실행: ${branchName}"
    
    // 로컬 실행 여부 판단
    def internalIPs = [env.JENKINS_HOST, env.JENKINS_HOST2]
    def isLocal = internalIPs.contains(remote)
    echo "📍 실행 모드: ${isLocal ? '로컬' : '원격'} (${remote})"

    def apacheConfPath = "/apps/apache/conf/extra/httpd-vhosts.conf"
    def appBasePath = env.APP_DIR
    def serverAlias = env.SERVER_ALIAS
    def v1Path = "${appBasePath}/web_v1"
    def v2Path = "${appBasePath}/web_v2"
    def mainDomain = env.MAIN_DOMAIN
    def developDomain = env.DEVELOP_DOMAIN
    def projectNameCompose = 'basic_web_'
    def serverName = (branchName == 'main') ? mainDomain : developDomain
    def currentPort = ''

    script {
        currentPort = getCurrentProxyPort(remote, apacheConfPath, serverAlias, isLocal)
    }

    echo "🔍 현재 사용 중인 React 프록시 포트: ${currentPort}"

    if (!currentPort) {
        error "❌ ProxyPass 포트를 찾지 못했습니다. vhosts.conf에 '${serverName}' 섹션을 확인하세요."
    }

    if (currentPort == "3028") {
        env.ACTIVE_VERSION = "v1"
        env.NEXT_VERSION = "v2"
        env.NEXT_REACT_PORT = "3030"
        env.NEXT_NODE_PORT = "3031"
        env.CURRENT_REACT_PORT = "3028"
        env.CURRENT_NODE_PORT = "3029"
    } else {
        env.ACTIVE_VERSION = "v2"
        env.NEXT_VERSION = "v1"
        env.NEXT_REACT_PORT = "3028"
        env.NEXT_NODE_PORT = "3029"
        env.CURRENT_REACT_PORT = "3030"
        env.CURRENT_NODE_PORT = "3031"
    }

    def composeProject = "${projectNameCompose}${env.NEXT_VERSION}"

    env.NEXT_PATH = "${appBasePath}/web_${env.NEXT_VERSION}"
    echo "🔁 다음 배포 타겟: ${env.NEXT_VERSION} (${env.NEXT_REACT_PORT}/${env.NEXT_NODE_PORT})"

    // 2. Checkout & Deploy to Next Version
    echo "📦 다음 버전에 코드 배포 중..."
    def deployScript = """
        set -e
        echo "📦 ${env.NEXT_PATH} 디렉토리에 코드 배포 시작"

        cd ${env.NEXT_PATH}


        echo "🧹 기존 Created 상태 컨테이너 정리"
        docker ps -a --filter "status=created" --filter "name=basic" -q | xargs -r docker rm -f

        echo "🔍 현재 포트를 점유한 컨테이너 제거 시도"
        REACT_CID=\$(docker ps -q --filter "publish=${env.NEXT_REACT_PORT}")
        NODE_CID=\$(docker ps -q --filter "publish=${env.NEXT_NODE_PORT}")
        [ -n "\$REACT_CID" ] && docker rm -f \$REACT_CID || echo "✅ React 포트 비어 있음"
        [ -n "\$NODE_CID" ] && docker rm -f \$NODE_CID || echo "✅ Node 포트 비어 있음"

        echo "🔄 원격 저장소 최신 상태 가져오기"
        git fetch origin

        echo "✅ git pull 로 코드 업데이트"
        git reset --hard
        git clean -fd
        git pull origin ${branchName}

        echo "📜 최신 커밋 정보 추출"
        git log -1 --pretty=format:'GIT_COMMIT_AUTHOR=%an%nGIT_COMMIT_MESSAGE=%s%nGIT_COMMIT_TIME=%cd' > /tmp/git_commit_info.txt

        echo "🚀 Docker Compose 빌드 및 실행"
        COMPOSE_PROJECT_NAME=${composeProject} docker compose -f docker-compose.${env.NEXT_VERSION}.yml down || true
        COMPOSE_PROJECT_NAME=${composeProject} docker compose -f docker-compose.${env.NEXT_VERSION}.yml up -d --build
    """
    
    if (isLocal) {
        sh "${deployScript}"
    } else {
        sh "ssh -o StrictHostKeyChecking=no ${remote} '${deployScript}'"
    }

    // 2-1. 커밋 정보 가져오기
    def output = ''
    if (isLocal) {
        output = sh(
            script: "cat /tmp/git_commit_info.txt",
            returnStdout: true
        ).trim()
    } else {
        output = sh(
            script: "ssh -o StrictHostKeyChecking=no ${remote} 'cat /tmp/git_commit_info.txt'",
            returnStdout: true
        ).trim()
    }

    // 2-2. Jenkins 환경변수로 커밋 정보 설정
    def lines = output.readLines()
    env.GIT_COMMIT_AUTHOR  = lines.find { it.startsWith("GIT_COMMIT_AUTHOR=") }?.split("=")[1]?.trim() ?: 'unknown'
    env.GIT_COMMIT_MESSAGE = lines.find { it.startsWith("GIT_COMMIT_MESSAGE=") }?.split("=")[1]?.trim() ?: 'unknown'
    env.GIT_COMMIT_TIME    = lines.find { it.startsWith("GIT_COMMIT_TIME=") }?.split("=")[1]?.trim() ?: 'unknown'

    echo "📢 커밋 정보:"
    echo "👤 Author : ${env.GIT_COMMIT_AUTHOR}"
    echo "📝 Message: ${env.GIT_COMMIT_MESSAGE}"
    echo "🕒 Time   : ${env.GIT_COMMIT_TIME}" 

    // 3. Health Check
    echo "🏥 헬스 체크 중..."
    def healthCheckScript = """
        set -e
        echo "🔍 React 앱 헬스 체크 시작..."

        for i in {1..15}; do
            if curl -H "User-Agent: HealthCheck/1.0" http://localhost:${env.NEXT_REACT_PORT}/; then
                echo "✅ React 앱 정상 작동"
                exit 0
            fi
            echo "⏳ React 앱 대기 중 (\\\$i/15)"
            sleep 3
        done

        echo "❌ React 앱 헬스체크 실패"
        exit 1
    """

    def healthCheckNodeScript = """
        set -e
        echo "🔍 Node 앱 헬스 체크 시작..."

        for i in {1..15}; do
            if curl -H "User-Agent: HealthCheck/1.0" http://localhost:${env.NEXT_NODE_PORT}/health; then
                echo "✅ Node 앱 정상 작동"
                exit 0
            fi
            echo "⏳ Node 앱 대기 중 (\\\$i/15)"
            sleep 3
        done

        echo "❌ Node 앱 헬스체크 실패"
        exit 1
    """

    int reactHealthCheck = 0
    int nodeHealthCheck = 0
    
    if (isLocal) {
        reactHealthCheck = sh(
            script: "${healthCheckScript}",
            returnStatus: true
        )
        if (reactHealthCheck == 0) {
            nodeHealthCheck = sh(
                script: "${healthCheckNodeScript}",
                returnStatus: true
            )
        }
    } else {
        reactHealthCheck = sh(
            script: "ssh -o StrictHostKeyChecking=no ${remote} '${healthCheckScript}'",
            returnStatus: true
        )
        if (reactHealthCheck == 0) {
            nodeHealthCheck = sh(
                script: "ssh -o StrictHostKeyChecking=no ${remote} '${healthCheckNodeScript}'",
                returnStatus: true
            )
        }
    }

    if (reactHealthCheck != 0) {
        error "❌ React 헬스체크 실패. 배포 중단."
    }
    if (nodeHealthCheck != 0) {
        error "❌ Node 헬스체크 실패. 배포 중단."
    }

    // 4. Switch Apache Ports
    echo "📝 Apache 프록시 포트 전환 중... to ${env.NEXT_REACT_PORT} / ${env.NEXT_NODE_PORT}"

    // 변수를 미리 치환해서 전달
    def switchScript = """
        echo "📝 Apache 프록시 포트 전환"
        sed -i 's|http://localhost:${env.CURRENT_REACT_PORT}/|http://localhost:${env.NEXT_REACT_PORT}/|g' /apps/apache/conf/extra/httpd-vhosts.conf
        sed -i 's|http://localhost:${env.CURRENT_NODE_PORT}/|http://localhost:${env.NEXT_NODE_PORT}/|g' /apps/apache/conf/extra/httpd-vhosts.conf
        /apps/apache/bin/apachectl configtest && /apps/apache/bin/apachectl graceful
    """

    if (isLocal) {
        sh "${switchScript}"
    } else {
        sh "ssh -o StrictHostKeyChecking=no ${remote} \"${switchScript}\""
    }

    // 5. Mirror Active to Backup
    echo "🔄 백업 디렉토리 최신화 중..."
    def mirrorPath = env.ACTIVE_VERSION == 'v1' ? "${env.APP_DIR}/web_v1" : "${env.APP_DIR}/web_v2"
    def mirrorVersion = env.ACTIVE_VERSION == 'v1' ? 'v1' : 'v2'
    def mirrorComposeProject = "${projectNameCompose}${mirrorVersion}"

    def mirrorScript = """
        set -e
        echo "🔄 백업 디렉토리(${mirrorPath}) 최신화 시작"

        cd ${mirrorPath}
        
        echo "🔄 원격 저장소 최신 상태 가져오기"
        git fetch origin

        echo "📥 Git 최신 코드 pull"
        git reset --hard
        git clean -fd
        git pull origin ${branchName} 

        echo "🐳 Docker 재빌드 및 실행"
        COMPOSE_PROJECT_NAME=${mirrorComposeProject} docker compose -f docker-compose.${mirrorVersion}.yml down || true
        COMPOSE_PROJECT_NAME=${mirrorComposeProject} docker compose -f docker-compose.${mirrorVersion}.yml up -d --build
    """

    if (isLocal) {
        sh "${mirrorScript}"
    } else {
        sh "ssh -o StrictHostKeyChecking=no ${remote} '${mirrorScript}'"
    }
    
    echo "🎉 Blue/Green 배포 완료! React: ${env.NEXT_REACT_PORT} / Node: ${env.NEXT_NODE_PORT}"
}

// getCurrentProxyPort 함수도 로컬/원격 대응
def getCurrentProxyPort(remote, apacheConfPath, serverAlias, isLocal) {
    def grepScript = """
if [ -f "${apacheConfPath}" ]; then
    awk '
        /<VirtualHost/ { in_vhost=1; in_target=0 }
        /ServerAlias.*${serverAlias}/ && in_vhost { in_target=1 }
        /ProxyPass/ && in_target {
            if (\$0 ~ /localhost:[0-9]+/) {
                match(\$0, /localhost:([0-9]+)/, a);
                print a[1];
                exit
            }
        }
        /<\\/VirtualHost>/ { in_vhost=0; in_target=0 }
    ' "${apacheConfPath}"
else
    echo ""
fi
"""

    def port = ''
    if (isLocal) {
        port = sh(
            script: grepScript,
            returnStdout: true
        ).trim()
    } else {
        port = sh(
            script: """
            ssh -o StrictHostKeyChecking=no ${remote} <<'EOF'
${grepScript}
EOF
            """,
            returnStdout: true
        ).trim()
    }

    return port
}



// 🔔 빌드 실패 시 이메일
def sendMailOnFailure(errorMessage) {
    emailext (
        subject: "🔴 빌드 실패: ${env.JOB_NAME} #${env.BUILD_NUMBER} (${env.GIT_BRANCHSTRIP})",
        body: """
        <h2>❌ Jenkins 빌드 실패</h2>
        <p>🔹 브랜치: ${env.GIT_BRANCHSTRIP}</p>
        <p>🔹 커밋: ${env.GIT_COMMIT_MESSAGE}</p>
        <p>🔹 작성자: ${env.GIT_COMMIT_AUTHOR}</p>
        <p>🔹 시간: ${env.GIT_COMMIT_TIME}</p>
        <p>📜 <a href="${env.BUILD_URL}console">로그 보기</a></p>
        """,
        to: "${env.RECIPIENTS}",
        from: "no-reply@likeweb.co.kr"
    )
}

// ✅ 빌드 성공 시 이메일
def sendMailOnSuccess() {
    emailext (
        subject: "✅ 빌드 성공: ${env.JOB_NAME} 활성버전: ${env.NEXT_VERSION} #${env.BUILD_NUMBER} (${env.GIT_BRANCHSTRIP})",
        body: """
        <h2>🎉 Jenkins 빌드 성공 ${env.NEXT_VERSION}</h2>
        <p>🔹 활성버전: ${env.NEXT_VERSION}</p>
        <p>🔹 브랜치: ${env.GIT_BRANCHSTRIP}</p>
        <p>🔹 커밋: ${env.GIT_COMMIT_MESSAGE}</p>
        <p>🔹 작성자: ${env.GIT_COMMIT_AUTHOR}</p>
        <p>🔹 시간: ${env.GIT_COMMIT_TIME}</p>
        <p>📜 <a href="${env.BUILD_URL}console">로그 보기</a></p>
        """,
        to: "${env.RECIPIENTS}",
        from: "no-reply@likeweb.co.kr"
    )
}
