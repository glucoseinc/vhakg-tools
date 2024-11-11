import { NamedNode } from 'rdf-js';
import { makeClient } from 'common/utils/sparql';

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

export type EventQueryType = {
  event: NamedNode;
};
export const fetchEvent: (
  action: string,
  mainObject: string,
  targetObject: string
) => Promise<EventQueryType[]> = async (action, mainObject, targetObject) => {
  const query = `
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    PREFIX vh2kg: <http://kgrc4si.home.kg/virtualhome2kg/ontology/>
    SELECT DISTINCT ?event WHERE {
      ?mainObject rdfs:label ?mainObjectLabel FILTER regex(?mainObjectLabel, "${mainObject}", "i") .
      ${
        targetObject !== ''
          ? `?targetObject rdfs:label ?targetObjectLabel FILTER regex(?targetObjectLabel, "${targetObject}", "i") .`
          : ''
      }
      ?event vh2kg:mainObject ?mainObject ;
             ${targetObject !== '' ? 'vh2kg:targetObject ?targetObject ;' : ''}
             vh2kg:action <${action}> .
    } ORDER BY asc(?event)
  `;
  const result = (await makeClient().query.select(query)) as EventQueryType[];
  return result;
};
