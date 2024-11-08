import ParsingClient from 'sparql-http-client/ParsingClient';

export const makeClient = () => {
  const endpointUrl = 'http://localhost:7200/repositories/kgrc4si';
  return new ParsingClient({
    endpointUrl: `${endpointUrl}?infer=false`,
  });
};

export const PREFIXES = {
  ex: 'http://kgrc4si.home.kg/virtualhome2kg/instance/',
  mssn: 'http://mssn.sigappfr.org/mssn/',
  rdf: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#',
  vh2kg: 'http://kgrc4si.home.kg/virtualhome2kg/ontology/',
};
