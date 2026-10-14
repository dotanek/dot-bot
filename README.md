## Getting started

```bash
$ npm install
```

Set up environment variables by renaming `.env.example` file to `.env` and modifying its values.

Set up database (requires docker)
```bash
docker-compose up -d database
```

Run the application

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev
```

## Deployment Setup (GitHub Actions)

The `Deploy` workflow builds the Docker image, pushes it to ECR, and deploys it to ECS. It needs the variables and secrets to be configured in GitHub before it can run.

### Requirements

- The ECR repository, ECS cluster, and ECS service must already exist.
- The IAM user needs permissions to push to ECR, describe and register ECS task definitions, update the ECS service, and `iam:PassRole` for the task and execution roles. Preferably use the minimum possible permissions for this.
- The container name in the task definition must be `Main`.

### Secrets

| Name | Description |
|---|---|
| `AWS_ACCESS_KEY_ID` | Access key ID of the IAM user used for deployment |
| `AWS_ACCESS_KEY_SECRET` | Secret access key for that IAM user |

### Variables

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
- Add terraform files and deploy roles with minimum privileges

## Known bugs

- PP command doesn't work if target (or self) never created user entity by invoking points command