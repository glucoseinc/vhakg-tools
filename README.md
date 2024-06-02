<p align="center">
<img src="https://img.shields.io/badge/-Python-F9DC3E.svg?logo=python&style=flat">
<img src="https://img.shields.io/badge/-Jupyter-FFF.svg?logo=jupyter&style=flat">
<img src="https://img.shields.io/badge/-React-555.svg?logo=react&style=flat">
<img src="https://img.shields.io/badge/-Docker-EEE.svg?logo=docker&style=flat">
<img src="https://img.shields.io/badge/license-MIT-blue.svg?style=flat">
</p>

# VHAKG tools


## How to use

### GUI

- Run `mkdir RDF` only for the first time
- Place RDF Data on RDF/ only for the first time
- Run `chmod +x entrypoint.sh` only for the first time
- Run `docker compose up --build -d`
- Wait for data to be loaded until the Docker GraphDB container displays the log `[main] INFO com.ontotext.graphdb.importrdf.Preload - Finished`.
- Open http://localhost:5050

### CLI

- Perform the same steps as in GUI
- Run `cd cli`
- Run `pip install -r requirements.txt` only for the first time
- Run `python mmkg-search.py -h` if you want to know command arguments
- Run `python mmkg-search.py args`

## How to develop

### GUI

- Run `mkdir RDF` only for the first time
- Place RDF Data on RDF/ only for the first time
- Run `chmod +x entrypoint.sh` only for the first time
- Run `COMPOSE_FILE=compose.yaml:development.yaml docker compose up`
- Wait for data to be loaded until the Docker GraphDB container displays the log `[main] INFO com.ontotext.graphdb.importrdf.Preload - Finished`.
- Open http://localhost:5051

#### Lint

- Run `docker compose exec app-dev sh -c "cd /app && yarn lint"`

#### Format

- Run `docker compose exec app-dev sh -c "cd /app && yarn format"`

### CLI

#### Environment

- Run `pyenv install  miniforge3-4.14.0-2`
- Run `pyenv virtualenv miniforge3-4.14.0-2 vhakg-tools`

## Experiments

An experimental example of dataset creation and LVLM evaluation using VHAKG  

### Dataset creation
- Run `pip install notebook`
- Run `create_benchmark_dataset.ipynb`

### Evaluation
- Run `pip install openai`
- Run `python evaluate_lvlm.py`