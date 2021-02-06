import { gql } from "apollo-server";

export const TRACKING_BALANCE = gql`
query (
  $address: String!
) {
  ethereum(network: bsc) {
    address(address: {is: $address}) {
      balances {
        currency {
          address
          name
          symbol
          decimals
          tokenType
        }
        value
      }
    }
  }
}
`;