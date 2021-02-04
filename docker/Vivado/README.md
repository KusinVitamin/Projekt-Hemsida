# Xilinx Vivado in Docker container
## Prerequisites
The directory in which the dockerfile is located should contain 4 files
```txt
.
├── Xilinx_Unified_Lin64.bin
├── wi_authentication_key
├── install_config.txt
└── Dockerfile
```


### Xilinx installation file
Download the Xilinx installation file from [https://www.xilinx.com/support/download/index.html/content/xilinx/en/downloadNav/vivado-design-tools/2020-2.html](https://www.xilinx.com/support/download/index.html/content/xilinx/en/downloadNav/vivado-design-tools/2020-2.html) and save it as `Xilinx_Unified_Lin64.bin`.

### Authentication token
Acquire an authentication token by unpack the downloaded Xilinx installation file and run `xsetup`. The default location for the authentication token is `~/Xilinx/wi_authentication_key`.

```bash
./Xilinx_Unified_Lin64.bin --keep --noexec --target ./Xilinx
./Xilinx/xsetup -b AuthTokenGen
```

## Usage

### Build image
```bash
docker build -t d0020e_xilinx:vivado .
```