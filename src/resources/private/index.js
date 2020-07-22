import { gql } from 'apollo-server';
import { genericCreateResolver } from '../util';

export const PrivateTypeDefs = gql`
    extend type Mutation {
        createFinishedUserMaintenance(input: FinishedUserMaintenanceCreationInput!): String
    }

    
`;

export const PrivateResolvers = {
    Mutation: {
        createFinishedUserMaintenance: genericCreateResolver
    }
}

