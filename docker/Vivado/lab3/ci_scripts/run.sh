#!/bin/bash

set -e

# get project directory path
PROJ_DIR=$(dirname "${BASH_SOURCE[0]}")/..
PROJ_DIR=$(readlink -f "${PROJ_DIR}")
cd "${PROJ_DIR}"

# prep
"${PROJ_DIR}/ci_scripts/prep_sim.sh"

# run
"${PROJ_DIR}/ci_scripts/run_sim.sh"
