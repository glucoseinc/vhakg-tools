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

export type VideoQueryType = {
  camera: NamedNode;
  base64Video: NamedNode;
};
export const fetchVideo: (
  action: string,
  mainObject: string,
  targetObject: string,
  limit: number,
  page: number
) => Promise<VideoQueryType[]> = async (
  action,
  mainObject,
  targetObject,
  limit,
  page
) => {
  const query = `
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    PREFIX vh2kg: <http://kgrc4si.home.kg/virtualhome2kg/ontology/>
    SELECT DISTINCT ?camera ?base64Video WHERE {
      ?mainObject rdfs:label ?mainObjectLabel FILTER regex(?mainObjectLabel, "${mainObject}", "i") .
      ${
        targetObject !== ''
          ? `?targetObject rdfs:label ?targetObjectLabel FILTER regex(?targetObjectLabel, "${targetObject}", "i") .`
          : ''
      }
      ?event vh2kg:mainObject ?mainObject ;
             ${targetObject !== '' ? 'vh2kg:targetObject ?targetObject ;' : ''}
             vh2kg:action <${action}> .
      ?activity vh2kg:hasEvent ?event ;
                vh2kg:hasVideo ?camera .
      ?camera vh2kg:video ?base64Video .
    } ORDER BY asc(?camera) LIMIT ${limit} OFFSET ${limit * (page - 1)}
  `;
  const result = (await makeClient().query.select(query)) as VideoQueryType[];
  return result;
};

export type VideoCountQueryType = {
  videoCount: NamedNode;
};
export const fetchVideoCount: (
  action: string,
  mainObject: string,
  targetObject: string
) => Promise<number> = async (action, mainObject, targetObject) => {
  const query = `
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    PREFIX vh2kg: <http://kgrc4si.home.kg/virtualhome2kg/ontology/>
    SELECT (COUNT(DISTINCT ?camera) AS ?videoCount) WHERE {
      ?mainObject rdfs:label ?mainObjectLabel FILTER regex(?mainObjectLabel, "${mainObject}", "i") .
      ${
        targetObject !== ''
          ? `?targetObject rdfs:label ?targetObjectLabel FILTER regex(?targetObjectLabel, "${targetObject}", "i") .`
          : ''
      }
      ?event vh2kg:mainObject ?mainObject ;
             ${targetObject !== '' ? 'vh2kg:targetObject ?targetObject ;' : ''}
             vh2kg:action <${action}> .
      ?activity vh2kg:hasEvent ?event ;
                vh2kg:hasVideo ?camera .
    }
  `;
  const result = (await makeClient().query.select(
    query
  )) as VideoCountQueryType[];
  return Number(result[0].videoCount.value);
};
