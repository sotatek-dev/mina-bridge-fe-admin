/* eslint-disable no-undef */

/**
 * Get GraphQL operation name.
 *
 * @param query - GraphQL query.
 * @returns `string`
 */
export function getOperationName(query: string = '') {
  const queryMatch = query.match(/(query|mutation) (\w+)(?=[(\s{])/u);

  if (queryMatch?.[2]) {
    return queryMatch[2];
  }

  throw new Error('GQL not valid');
}

/**
 * Send GraphQL request.
 *
 * @param networkConfig - Selected network config.
 * @param query - GraphQL query.
 * @param variables - GraphQL variables.
 */
export async function gql(url: string, query: any, variables: any = {}) {
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        query,
        operationName: getOperationName(query),
        variables,
      }),
    });

    const { data, errors } = await response.json();
    if (errors) throw new Error(errors[0].message);

    return data;
  } catch (err) {
    console.error('src/graphql/index.ts:30', err);
    throw err;
  }
}
