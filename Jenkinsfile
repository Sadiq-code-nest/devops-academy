pipeline {
  agent any

  options {
    timestamps()
    disableConcurrentBuilds()
  }

  environment {
    COMPOSE_PROJECT_NAME = 'devops-academy'
    MONGO_ROOT_USER     = credentials('mongo-root-user')
    MONGO_ROOT_PASSWORD = credentials('mongo-root-password')
    JWT_SECRET          = credentials('jwt-secret')
    ADMIN_USERNAME      = credentials('admin-username')
    ADMIN_PASSWORD      = credentials('admin-password')
    PUBLIC_URL          = credentials('public-url')
    NVD_API_KEY         = credentials('nvd-api-key')
  }

  stages {

    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Stage 1: Trivy Scan') {
      steps {
        sh '''
          docker run --rm -v $(pwd):/src aquasec/trivy:latest fs \
            --severity CRITICAL,HIGH --exit-code 1 /src
        '''
      }
    }

    stage('Stage 2: OWASP Dependency-Check') {
      steps {
        catchError(buildResult: 'SUCCESS', stageResult: 'UNSTABLE') {
          sh '''
            mkdir -p reports
            chmod 777 reports
            docker run --rm \
              -v $(pwd):/src \
              -v dependency-check-data:/usr/share/dependency-check/data \
              -v $(pwd)/reports:/report \
              owasp/dependency-check:latest \
              --project devops-academy --scan /src --format HTML --out /report \
              --nvdApiKey ${NVD_API_KEY} \
              --failOnCVSS 7
          '''
        }
      }
      post {
        always {
          archiveArtifacts artifacts: 'reports/*.html', allowEmptyArchive: true
        }
      }
    }

    stage('Stage 3: SonarQube Scan') {
      steps {
        withSonarQubeEnv('SonarQube') {
          sh '''
            mkdir -p .scannerwork
            chmod 777 .scannerwork
            docker run --rm --network host -v $(pwd):/usr/src sonarsource/sonar-scanner-cli \
              -Dsonar.projectKey=devops-academy \
              -Dsonar.sources=backend,frontend/src \
              -Dsonar.working.directory=/usr/src/.scannerwork \
              -Dsonar.host.url=$SONAR_HOST_URL \
              -Dsonar.token=$SONAR_AUTH_TOKEN
          '''
        }
      }
    }

    stage('Quality Gate') {
      steps {
        timeout(time: 5, unit: 'MINUTES') {
          waitForQualityGate abortPipeline: true
        }
      }
    }

    stage('Stage 4: Build Docker Images') {
      steps {
        sh '''
          cat > backend/.env << ENVEOF
PORT=5000
NODE_ENV=production
CLIENT_URL=${PUBLIC_URL}:8080

MONGO_INITDB_ROOT_USERNAME=${MONGO_ROOT_USER}
MONGO_INITDB_ROOT_PASSWORD=${MONGO_ROOT_PASSWORD}
MONGO_URI=mongodb://${MONGO_ROOT_USER}:${MONGO_ROOT_PASSWORD}@mongo:27017/devops_academy?authSource=admin

JWT_SECRET=${JWT_SECRET}

ADMIN_USERNAME=${ADMIN_USERNAME}
ADMIN_PASSWORD=${ADMIN_PASSWORD}

SMTP_HOST=${SMTP_HOST}
SMTP_PORT=${SMTP_PORT}
SMTP_USER=${SMTP_USER}
SMTP_PASS=${SMTP_PASS}
SMTP_FROM=${SMTP_USER}
ENVEOF

          cat > frontend/.env << ENVEOF
VITE_API_URL=${PUBLIC_URL}:5000/api
ENVEOF

          sed -i -E "s#VITE_API_URL: \\"[^\\"]+\\"#VITE_API_URL: \\"${PUBLIC_URL}:5000/api\\"#" docker-compose.yml

          export COMPOSE_BAKE=false
          docker compose build --no-cache
        '''
      }
    }

    stage('Stage 5: Deploy') {
      steps {
        sh '''
          export COMPOSE_BAKE=false
          docker compose up -d
          docker image prune -f
          docker compose ps
        '''
      }
    }
  }

  post {
    failure {
      echo 'Pipeline failed — check the stage that shows red above for the real error.'
    }
  }
}