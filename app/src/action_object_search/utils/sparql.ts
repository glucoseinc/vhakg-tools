import ParsingClient from 'sparql-http-client/ParsingClient';
import { NamedNode } from 'rdf-js';

const makeClient = () => {
  const endpointUrl = 'http://localhost:7200/repositories/kgrc4si';
  return new ParsingClient({
    endpointUrl: `${endpointUrl}?infer=false`,
  });
};

export type ActionQueryType = {
  action: NamedNode;
};
export const fetchAction: () => Promise<ActionQueryType[]> = async () => {
  const query = `
      PREFIX vh2kg: <http://kgrc4si.home.kg/virtualhome2kg/ontology/>
      select DISTINCT ?action where {
        ?action a vh2kg:Action .
      } order by asc(?action)
    `;
  const result = (await makeClient().query.select(query)) as ActionQueryType[];
  return result;
};
