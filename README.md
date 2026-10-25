## Getting started (Locally)

```bash
npm install
```

Set up environment variables by renaming `.env.example` file to `.env` and modifying its values.

Set up database (requires docker)
```bash
docker-compose up -d database
```

Run the application

```bash
# development
npm run start

# watch mode
npm run start:dev
```

## Infrastructure Setup (Terraform)

Requires [Terraform](https://developer.hashicorp.com/terraform/install) and the [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html). Run the commands from the Terraform directory.

Also requires an AWS IAM user that has sufficient permissions to make all the changes.

1. Rename `example.tfvars` to `terraform.tfvars` and fill in its values
2. Authenticate the AWS CLI using your access key:
   ```bash
   aws configure
   ```
3. Initialize terraform
   ```bash
   terraform init
   ```
4. Preview changes
   ```bash
   terraform plan
   ```
5. Apply changes
   ```bash
   terraform apply
   ```

6. Replace placeholder values in parameter store

| Parameter | Env variable | Description |
|---|---|---|
| `dot-bot_port` | `PORT` | Port the app listens on |
| `dot-bot_twitch-channel` | `TWITCH__CHANNEL` | Twitch channel the bot joins |
| `dot-bot_twitch-oauth-client-id` | `TWITCH__OAUTH_CLIENT_ID` | Twitch OAuth client ID |
| `dot-bot_twitch-oauth-client-secret` | `TWITCH__OAUTH_CLIENT_SECRET` | Twitch OAuth client secret |
| `dot-bot_twitch-oauth-redirect-uri` | `TWITCH__OAUTH_REDIRECT_URI` | Twitch OAuth redirect URI |
| `dot-bot_twitch-prefix` | `TWITCH__PREFIX` | Chat command prefix |

```bash
aws ssm put-parameter --name "<parameter>" --value "<value>" --overwrite --region eu-central-1
```

You can change all of those parameters at once with the local script

```bash
bash ./scripts/change-ssm-params.sh
```



#### Initial deploy

The ECS service can't start tasks until an image tagged `initial` exists in ECR, you can manually deploy that image:

Run these from root directory of the project.

1. Set the registry and image:
```bash
   REGISTRY=<account-id>.dkr.ecr.<region>.amazonaws.com
   IMAGE=$REGISTRY/<ecr-repository>:initial
```
2. Log in to ECR:
```bash
   aws ecr get-login-password --region <region> | docker login --username AWS --password-stdin $REGISTRY
```
3. Build and push the image:
```bash
   docker build --platform linux/amd64 -t $IMAGE .
   docker push $IMAGE
```
4. Force a new deployment:
```bash
   aws ecs update-service --cluster <cluster> --service <service> --force-new-deployment
```


## Deployment Setup (GitHub Actions)

The `Deploy` workflow builds the Docker image, pushes it to ECR tagged with the commit SHA, and deploys it to ECS.

### Requirements

- The infrastructure must already exist (see [Infrastructure Setup](#infrastructure-setup-terraform)).
- The IAM user needs permissions to push to ECR, describe and register ECS task definitions, update the ECS service, and `iam:PassRole` for the task and execution roles. Preferably use the minimum possible permissions for this.
- The container name in the task definition must be `Main`.

### GitHub requirements

#### Secrets

| Name | Description |
|---|---|
| `AWS_ACCESS_KEY_ID` | Access key ID of the IAM user used for deployment |
| `AWS_ACCESS_KEY_SECRET` | Secret access key for that IAM user |

#### Variables

| Name | Description | Example |
|---|---|---|
| `AWS_REGION` | AWS region of the resources | `eu-central-1` |
| `AWS_ECR_REPOSITORY` | ECR repository name | `dot-bot` |
| `AWS_ECS_TASK_DEFINITION_FAMILY` | ECS task definition family | `dot-bot` |
| `AWS_ECS_CLUSTER` | ECS cluster name | `dot-bot` |
| `AWS_ECS_SERVICE` | ECS service name | `dot-bot` |

### Running

The workflow runs on pushes to `main` and can be triggered manually from the **Actions** tab (**Run workflow**).

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).

## To do

- Integrate with twitch api for username to userId lookup
- Add deploy roles with minimum privileges to Terraform
- Add role & user creation script for running Terraform

## Known bugs

- PP command doesn't work if target (or self) never created user entity by invoking points command