pipeline {
    agent any

    environment {
        SONAR_HOME = tool "sonar"
    }

    stages {

        stage("Clone Code From Github") {
            steps {
                git url: "https://github.com/Rakeshcrv/garbage-management-system.git", branch: "devops"
            }
        }

        stage("SonarQube Quality Analysis") {
            steps {
                withSonarQubeEnv("sonar") {
                    sh "$SONAR_HOME/bin/sonar-scanner -Dsonar.projectName=GMS -Dsonar.projectKey=GMS"
                }
            }
        }

        stage("OWASP Dependency Check") {
            steps {
                dependencyCheck additionalArguments: '--scan ./', odcInstallation: 'dc'
                dependencyCheckPublisher pattern: '**/dependency-check-report.xml'
            }
        }

        stage("Sonar Quality Gate Scan") {
            steps {
                timeout(time: 2, unit: "MINUTES") {
                    waitForQualityGate abortPipeline: false
                }
            }
        }

        stage("Trivy File System Scan") {
            steps {
                sh "trivy fs --format table -o trivy-fs-report.html ."
            }
        }
        stage("Deploy using docker compose"){
            steps{
                sh "docker-compose up -d"
            }
        }
    }
}
