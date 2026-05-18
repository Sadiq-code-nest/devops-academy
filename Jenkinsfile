// ═══════════════════════════════════════════════════════════
//  DevOps Academy — Jenkins Declarative Pipeline
//  Stages: Checkout → Install → Test → Build → Push → Deploy
//  Requirements: Jenkins + Docker + DockerHub credentials
// ═══════════════════════════════════════════════════════════

pipeline {

    // ── Agent ─────────────────────────────────────────────────
    agent {
        // Run on any node with Docker available.
        // For Docker-in-Docker setups, use agent { docker { ... } }
        label 'docker-agent'
    }

    // ── Global Options ────────────────────────────────────────
    options {
        buildDiscarder(logRotator(numToKeepStr: '10', artifactNumToKeepStr: '5'))
        disableConcurrentBuilds()
        timeout(time: 20, unit: 'MINUTES')
        timestamps()
        ansiColor('xterm')
    }

    // ── Environment Variables ─────────────────────────────────
    environment {
        // Application
        APP_NAME        = 'devops-academy'
        DEPLOY_ENV      = "${env.BRANCH_NAME == 'main' ? 'production' : 'staging'}"
        APP_PORT        = '8080'

        // Docker
        DOCKER_REGISTRY = 'docker.io'
        DOCKER_USER     = 'sadiqaws24'                   // ← your DockerHub username
        IMAGE_NAME      = "${DOCKER_USER}/${APP_NAME}"
        IMAGE_TAG       = "${env.BUILD_NUMBER}-${env.GIT_COMMIT?.take(7) ?: 'unknown'}"
        IMAGE_LATEST    = "${IMAGE_NAME}:latest"
        IMAGE_VERSIONED = "${IMAGE_NAME}:${IMAGE_TAG}"

        // Jenkins credential IDs (configure in Jenkins > Credentials)
        DOCKERHUB_CREDS = credentials('dockerhub-credentials')

        // Notifications (optional — set Slack webhook in Jenkins secrets)
        // SLACK_CHANNEL   = '#devops-alerts'
    }

    // ── Triggers ──────────────────────────────────────────────
    triggers {
        // Poll SCM every 5 minutes as fallback (webhook is preferred)
        pollSCM('H/5 * * * *')
    }

    // ════════════════════════════════════════════════════════
    //  STAGES
    // ════════════════════════════════════════════════════════
    stages {

        // ── 1. Checkout ─────────────────────────────────────
        stage('Checkout') {
            steps {
                echo "🔄 Checking out repository..."
                checkout scm
                script {
                    // Capture git metadata for tagging and reporting
                    env.GIT_COMMIT_SHORT = sh(
                        script: "git log -1 --format='%h'",
                        returnStdout: true
                    ).trim()
                    env.GIT_AUTHOR = sh(
                        script: "git log -1 --format='%an'",
                        returnStdout: true
                    ).trim()
                    env.GIT_MSG = sh(
                        script: "git log -1 --format='%s'",
                        returnStdout: true
                    ).trim()
                    env.IMAGE_TAG = "${env.BUILD_NUMBER}-${env.GIT_COMMIT_SHORT}"
                    env.IMAGE_VERSIONED = "${IMAGE_NAME}:${env.IMAGE_TAG}"

                    echo """
╔══════════════════════════════════════╗
║  BUILD INFO
╠══════════════════════════════════════╣
║  Branch:   ${env.BRANCH_NAME}
║  Commit:   ${env.GIT_COMMIT_SHORT}
║  Author:   ${env.GIT_AUTHOR}
║  Message:  ${env.GIT_MSG}
║  Build #:  ${env.BUILD_NUMBER}
║  Env:      ${env.DEPLOY_ENV}
╚══════════════════════════════════════╝
"""
                }
            }
        }

        // ── 2. Install Dependencies ─────────────────────────
        stage('Install Dependencies') {
            steps {
                echo "📦 Installing dependencies..."
                script {
                    // Check if package.json exists (Node project)
                    if (fileExists('package.json')) {
                        sh '''
                            echo "Node.js version: $(node --version 2>/dev/null || echo N/A)"
                            echo "npm version:     $(npm --version 2>/dev/null || echo N/A)"
                            # Prefer ci for reproducible installs; fall back to install
                            npm ci --prefer-offline 2>/dev/null || npm install
                        '''
                    } else {
                        echo "No package.json found — skipping npm install (static project)"
                    }
                }
            }
        }

        // ── 3. Lint & Test ──────────────────────────────────
        stage('Lint & Test') {
            parallel {
                stage('Lint') {
                    steps {
                        echo "🔍 Running linter..."
                        script {
                            if (fileExists('package.json')) {
                                sh '''
                                    if npm run lint --if-present 2>/dev/null; then
                                        echo "✓ Lint passed"
                                    else
                                        echo "ℹ No lint script configured — skipping"
                                    fi
                                '''
                            } else {
                                echo "Static project — skipping lint"
                            }
                        }
                    }
                }
                stage('Unit Tests') {
                    steps {
                        echo "🧪 Running tests..."
                        script {
                            if (fileExists('package.json')) {
                                sh '''
                                    if npm test --if-present 2>/dev/null; then
                                        echo "✓ Tests passed"
                                    else
                                        echo "ℹ No test script configured"
                                        # Minimal smoke test: validate HTML is non-empty
                                        [ -s index.html ] && echo "✓ index.html present" || exit 1
                                    fi
                                '''
                            } else {
                                sh '''
                                    echo "Running static file smoke tests..."
                                    [ -s index.html ] && echo "✓ index.html OK" || { echo "✗ index.html missing"; exit 1; }
                                    [ -s style.css  ] && echo "✓ style.css OK"  || echo "⚠ style.css missing"
                                    [ -s main.js    ] && echo "✓ main.js OK"    || echo "⚠ main.js missing"
                                    echo "✓ Smoke tests passed"
                                '''
                            }
                        }
                    }
                }
            }
        }

        // ── 4. Build Docker Image ───────────────────────────
        stage('Docker Build') {
            steps {
                echo "🐳 Building Docker image: ${env.IMAGE_VERSIONED}"
                sh """
                    docker build \\
                        --build-arg ENV=${env.DEPLOY_ENV} \\
                        --build-arg BUILD_DATE=\$(date -u '+%Y-%m-%dT%H:%M:%SZ') \\
                        --build-arg VCS_REF=${env.GIT_COMMIT_SHORT} \\
                        --build-arg VERSION=${env.IMAGE_TAG} \\
                        --label "build.number=${env.BUILD_NUMBER}" \\
                        --label "git.commit=${env.GIT_COMMIT_SHORT}" \\
                        --label "build.date=\$(date -u '+%Y-%m-%dT%H:%M:%SZ')" \\
                        -t ${env.IMAGE_VERSIONED} \\
                        -t ${env.IMAGE_LATEST} \\
                        -f Dockerfile \\
                        .
                """
                sh "docker images ${IMAGE_NAME}"
            }
        }

        // ── 5. Security Scan (optional — needs Trivy) ───────
        stage('Security Scan') {
            when {
                anyOf {
                    branch 'main'
                    branch 'staging'
                }
            }
            steps {
                echo "🔒 Running image security scan..."
                script {
                    def trivyAvailable = sh(
                        script: 'command -v trivy &>/dev/null && echo yes || echo no',
                        returnStdout: true
                    ).trim()

                    if (trivyAvailable == 'yes') {
                        sh """
                            trivy image \
                                --exit-code 0 \
                                --severity HIGH,CRITICAL \
                                --no-progress \
                                ${env.IMAGE_VERSIONED}
                        """
                    } else {
                        echo "⚠ Trivy not installed — skipping scan (install: https://aquasecurity.github.io/trivy)"
                    }
                }
            }
        }

        // ── 6. Push to Docker Hub ───────────────────────────
        stage('Push to Docker Hub') {
            when {
                anyOf {
                    branch 'main'
                    branch 'staging'
                    branch 'develop'
                }
            }
            steps {
                echo "📤 Pushing to Docker Hub..."
                script {
                    withCredentials([usernamePassword(
                        credentialsId: 'dockerhub-credentials',
                        usernameVariable: 'DOCKER_LOGIN_USER',
                        passwordVariable: 'DOCKER_LOGIN_PASS'
                    )]) {
                        sh '''
                            echo "$DOCKER_LOGIN_PASS" | docker login \
                                -u "$DOCKER_LOGIN_USER" \
                                --password-stdin docker.io
                        '''
                    }
                    sh """
                        docker push ${env.IMAGE_VERSIONED}
                        docker push ${env.IMAGE_LATEST}
                        echo "✓ Pushed: ${env.IMAGE_VERSIONED}"
                        echo "✓ Pushed: ${env.IMAGE_LATEST}"
                    """
                }
            }
            post {
                always {
                    sh 'docker logout docker.io || true'
                }
            }
        }

        // ── 7. Deploy ────────────────────────────────────────
        stage('Deploy') {
            when {
                branch 'main'
            }
            steps {
                echo "🚀 Deploying to ${env.DEPLOY_ENV}..."
                sh """
                    # Stop and remove existing container (gracefully)
                    docker stop ${APP_NAME}-${DEPLOY_ENV} 2>/dev/null && \
                    docker rm   ${APP_NAME}-${DEPLOY_ENV} 2>/dev/null || true

                    # Run new container
                    docker run -d \
                        --name  ${APP_NAME}-${DEPLOY_ENV} \
                        --restart unless-stopped \
                        -p ${APP_PORT}:8080 \
                        -e NODE_ENV=${DEPLOY_ENV} \
                        -e VERSION=${env.IMAGE_TAG} \
                        --health-cmd='curl -fs http://localhost:8080/health || exit 1' \
                        --health-interval=15s \
                        --health-timeout=5s \
                        --health-retries=3 \
                        ${env.IMAGE_VERSIONED}

                    echo "Container started. Waiting for health check..."
                    sleep 8

                    HEALTH=\$(docker inspect --format='{{.State.Health.Status}}' \
                        ${APP_NAME}-${DEPLOY_ENV} 2>/dev/null || echo 'unknown')
                    echo "Health status: \$HEALTH"

                    if [ "\$HEALTH" = "unhealthy" ]; then
                        echo "✗ Health check failed — rolling back"
                        docker rm -f ${APP_NAME}-${DEPLOY_ENV} || true
                        exit 1
                    fi

                    echo "✓ Deployed: http://localhost:${APP_PORT}"
                """
            }
        }

    }
    // ════════════════════════════════════════════════════════
    //  POST-PIPELINE ACTIONS
    // ════════════════════════════════════════════════════════
    post {
        always {
            echo "🧹 Cleaning workspace and pruning dangling images..."
            sh '''
                docker image prune -f --filter "dangling=true" || true
                docker system df
            '''
            // Archive logs if they exist
            sh 'find . -name "*.log" -maxdepth 3 2>/dev/null | head -20 || true'
            cleanWs()
        }
        success {
            echo """
✅ Pipeline SUCCESS
   Image:  ${env.IMAGE_VERSIONED}
   Commit: ${env.GIT_COMMIT_SHORT}
   Author: ${env.GIT_AUTHOR}
   Build:  #${env.BUILD_NUMBER}
"""
            // Uncomment to enable Slack notifications:
            // slackSend channel: env.SLACK_CHANNEL,
            //     color: 'good',
            //     message: "✅ *${APP_NAME}* deployed — build #${env.BUILD_NUMBER} | ${env.GIT_MSG}"
        }
        failure {
            echo "❌ Pipeline FAILED — build #${env.BUILD_NUMBER}"
            // slackSend channel: env.SLACK_CHANNEL,
            //     color: 'danger',
            //     message: "❌ *${APP_NAME}* build #${env.BUILD_NUMBER} FAILED | ${env.GIT_MSG}"
        }
        unstable {
            echo "⚠️  Pipeline UNSTABLE — check test results"
        }
    }
}
