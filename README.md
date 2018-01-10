# gatsby-source-behance
> Gatsby.js source plugin for loading information from Behance

Learn more about [Gatsby](https://www.gatsbyjs.org/) and its plugins here: [https://www.gatsbyjs.org/docs/plugins/](https://www.gatsbyjs.org/docs/plugins/)

**See it in live action on the [example site](https://confident-perlman-063f75.netlify.com/)!**

## Install

```bash
npm install gatsby-source-behance
```

## How to use

```Javascript
// In your gatsby-config.js
plugins: [
    {
        resolve: `gatsby-source-behance`,
        options: {
            // Visit your profile and grab the name after behance.net/<< username >>
            username: '<< Your username >>',
            // You can get your API Key here: https://www.behance.net/dev/register
            apiKey: '<< API Key >>',
        }
    }
]
```

## GraphQL Queries

Get all projects of the user:

```graphql
{
    allBehanceProjects {
        edges {
            node {
                name
                projectID
                published
                created
                modified
                conceived
                url
                areas
                cover
                stats {
                    views
                    appreciations
                    comments
                }
            }
        }
    }
}
```

Get all user information:

```graphql
{
    behanceUser {
        names {
            displayName
            firstName
            lastName
            username
        }
        userID
        url
        website
        avatar
        company
        place {
            city
            state
            country
            location
        }
        areas
        stats {
            followers
            following
            appreciations
            views
            comments
            team_members
        }
        links {
            title
            url
        }
        sections
        socialMedia {
            social_id
            url
            service_name
            value
        }
    }
}
```