# Event Reminder Slack slash command

The project is deployment scripts of an event reminding bot of Slack.
The bot is implemented with AWS API Gateway and Lambda.

## Structure

```plantuml
@startuml
node "Slack" {
  [Slack App]
}

cloud "AWS" {
  [API Gateway]
  [Lambda]
}

[Client] -r-> [Slack App]
[Slack App] -r-> [API Gateway] : Post
[API Gateway] -r-> [Lambda]
@enduml
```

## Prerequisite

* AWS CLI
* AWS SAM CLI
* Docker
* nodejs/npm

## Deploy AWS components

```bash
sam build
sam deploy --guided
```

## Clean up

```bash
aws cloudformation delete-stack --stack-name event-reminder
```

## Contribution

Unit test an application.

```bash
cd event-reminder
npm install
npm run test
```

Build an application.

```bash
sam build
```

Run functions locally and invoke them.

```bash
sam local invoke HelloWorldFunction --event events/event.json
```
