# gatsby-source-behance
> Gatsby.js source plugin for loading information from Behance

Learn more about [Gatsby](https://www.gatsbyjs.org/) and its plugins here: [https://www.gatsbyjs.org/docs/plugins/](https://www.gatsbyjs.org/docs/plugins/)

**See it in live action on the [example site](https://behance-example.netlify.com/)!**
[Source Code](https://github.com/LeKoArts/gatsby-source-behance-example) for the example site.

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

To see all possible queries please use the GraphiQL editor which is available under ``http://localhost:8000/___graphql``

### Get all projects (of the user specified in the config):

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
                privacy
                areas
                tags
                description
                tools
                styles
                covers {
                    size_original
                }
                owners
                stats {
                    views
                    appreciations
                    comments
                }
                modules {
                    sizes {
                        size_original
                    }
                }
            }
        }
    }
}
```
_This example query fetches the information about the project and the respective images the project has_

### Get all user information:

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

### Get all collections (of the user specified in the config):

```graphql
{
    allBehanceAppreciations {
        edges {
            node {
                id
                projectID
                name
                projectCount
                data
                public
                created
                updated
                modified
                url
                covers {
                    size2 {
                        url
                    }
                    size3 {
                        url
                    }
                }
                owners {
                    username
                    city
                }
                isOwner
                isCoOwner
                multipleOwners
                galleryText
                stats
                creatorID
                userID
                projects {
                    id
                    name
                    published_on
                    created_on
                    modified_on
                    url
                    fields
                    covers {
                        size_original
                    }
                }
            }
        }
    }
}
```