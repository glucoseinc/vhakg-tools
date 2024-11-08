import ParsingClient from 'sparql-http-client/ParsingClient';

export const makeClient = () => {
  const endpointUrl = 'http://localhost:7200/repositories/kgrc4si';
  return new ParsingClient({
    endpointUrl: `${endpointUrl}?infer=false`,
  });
};
