# <%= userviceName %> Architecture

We encourage you to explain the architecture of this component, avoiding keeping it in a distant place of this project, like in a Google Drive Document. If this project have a wiki, then you can get rid of ARCHITECTURE.md file and address it there.

Try using an image to help people understand it. How to use images:

1. Create an issue in the project and [attach the image(s)](https://help.github.com/articles/file-attachments-on-issues-and-pull-requests/) you want to use there. Write something cool and harmless - well this is an issue that is not an issue;

2. Grab the generated URL for the image(s)! In markdown you should see something like `![github-help](https://cloud.githubusercontent.com/assets/7647451/23706522/4a4b9c8a-03ed-11e7-8077-6b353d3e1836.png)`, which give you this result:
![github-help](https://cloud.githubusercontent.com/assets/7647451/23706522/4a4b9c8a-03ed-11e7-8077-6b353d3e1836.png)

3. Close the issue!!!

## Objective

Describe what is this service purpose, goal, objective.

## Services Integrations

Does it have dependencies, a database? Describe one by one!

## Design

Does it have  a specific software design, are you using design patterns?

Do we have assumptions made to develop this software? Can you list them?

### Docker-compose Services

Which services this project must have in a container?

## Application Program Interface

Does it expose a RESTful API? Or other type of API? Please give a glimpse of it!

Do you have an API documentation? Give the link to it!

## Non-functional Requirements

Remember to describe non-functional requirements that this component can accept or must adhere.

Does it:

- scale?
- must support a certain number of users/requests? have a load limit?
- have a protocol adherence?
