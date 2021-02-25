# Xilinx Vivado in Docker container

## Getting started
### Prerequisites
The directory in which the dockerfile is located should contain 4 files
```txt
.
├── Xilinx_Unified_Lin64.bin
├── wi_authentication_key
├── install_config.txt
└── Dockerfile
```


#### Xilinx installation file
Download the Xilinx installation file from [https://www.xilinx.com/support/download/index.html/content/xilinx/en/downloadNav/vivado-design-tools/2020-2.html](https://www.xilinx.com/support/download/index.html/content/xilinx/en/downloadNav/vivado-design-tools/2020-2.html) and save it as `Xilinx_Unified_Lin64.bin`.

#### Authentication token
Acquire an authentication token by unpack the downloaded Xilinx installation file and run `xsetup`. The default location for the authentication token is `~/Xilinx/wi_authentication_key`.

```bash
./Xilinx_Unified_Lin64.bin --keep --noexec --target ./Xilinx
./Xilinx/xsetup -b AuthTokenGen
```

### Build images
#### Base image
```bash
docker build -t d0020e_xilinx:vivado .
```
#### Grading image
```bash
docker build -t d0020e_xilinx:run_lab -f Dockerfile.run_lab .
```

## Usage
### Run container manually with bash
```bash
docker run -t -i d0020e_xilinx:run_lab /bin/bash
```

### Run container in "automode"
1. Create volume
2. Create container with attach volume
3. Copy files to container
4. Run container
5. Copy `simulate.log` to host
6. Remove volume

```bash
docker volume create vivado_testbench_volume_1
docker create --name=vivado_testbench_1 -v vivado_testbench_volume_1:/root/src d0020e_xilinx:run_lab
docker cp lab3/. vivado_testbench_1:/root/src
docker container start -i vivado_testbench_1
docker cp vivado_testbench_1:/root/src/sim/xsim/simulate.log ./test_results/simulate.log
docker volume rm vivado_testbench_volume_1
```
