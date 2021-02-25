#!/bin/bash

set -e

# get project directory path
PROJ_DIR=$(dirname "${BASH_SOURCE[0]}")/..
PROJ_DIR=$(readlink -f "${PROJ_DIR}")

# get environment variables
source "${PROJ_DIR}/ci_scripts/vars.sh"

# run testbench
cd "${PROJ_DIR}/sim/xsim"
"./${CI_TESTBENCH}.sh"

# find ERROR
ERRORPATTERN="Error: Assertion violation"
if grep -q "${ERRORPATTERN}" "${PROJ_DIR}/sim/xsim/simulate.log"; then
  # ERROR found
  echo "===================================="
  echo "==========  OH NO !!!!  ============"
  echo "===================================="
  exit -1
else
  # no ERROR found
  echo "===================================="
  echo "=============  OK !!  =============="
  echo "===================================="
  exit 0
fi
