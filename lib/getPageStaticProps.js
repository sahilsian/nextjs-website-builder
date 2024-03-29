import { gql } from "@apollo/client"
import client from "./client"
import { cleanAndTransformBlocks } from "./cleanAndTransformBlocks"
import { mapMainMenuItems } from "./mapMainMenuItems"

export const getPageStaticProps = async (context) => {
  const uri = context?.params?.slug ? `/${context.params.slug.join("/")}/` : "/"
  const { data } = await client.query({
    query: gql`
        query PageQuery($uri: String!) {
          nodeByUri(uri: $uri) {
            ... on Page {
              id
              blocks
              seo {
                title
                metaDesc
                opengraphImage {
                  uri
                }
              }
            }
            ... on Program {
                id
                blocks
                seo {
                title
                metaDesc
                opengraphImage {
                  uri
                }
              }
              }
          }
          acfOptionsMainMenu {
            mainMenu {
              callToActionButton {
                destination {
                  ... on Page {
                    uri
                  }
                }
                label
              }
              menuItems {
                menuItem {
                  destination {
                    ... on Page {
                      uri
                    }
                  }
                  label
                }
                items {
                  destination {
                    ... on Page {
                      uri
                    }
                  }
                  label
                  subLabel
                }
              }
              socialLinks {
                facebook
                instagram
                tiktok
              }
            }
          }
        }
        `,
    variables: {
      uri
    }
  })

  console.log(data.acfOptionsMainMenu)

  return {
    props: {
      seo: data.nodeByUri?.seo,
      mainMenuItems: mapMainMenuItems(data.acfOptionsMainMenu.mainMenu.menuItems),
      blocks: cleanAndTransformBlocks(data.nodeByUri.blocks),
      callToActionLabel: data.acfOptionsMainMenu.mainMenu.callToActionButton.label,
      callToActionDestination: data.acfOptionsMainMenu.mainMenu.callToActionButton.destination.uri,
      social: data.acfOptionsMainMenu.mainMenu.socialLinks
    }
  }
}