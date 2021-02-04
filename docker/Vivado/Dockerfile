FROM ubuntu:20.04

COPY Xilinx_Unified_Lin64.bin /root/temp/
COPY wi_authentication_key /root/.Xilinx/
COPY install_config.txt /root/temp/

    # Prepare
RUN apt-get update && \
    apt-get install -y gcc && \
    chmod a+x /root/temp/Xilinx_Unified_Lin64.bin && \
    mkdir /root/temp/Xilinx && \
    # Install
    /root/temp/Xilinx_Unified_Lin64.bin --keep --noexec --target /root/temp/Xilinx && \
    /root/temp/Xilinx/xsetup -b Install -a XilinxEULA,3rdPartyEULA,WebTalkTerms -c /root/temp/install_config.txt && \
    # Cleanup
    rm -r /root/temp/ && \
    # Setup
    link /lib/x86_64-linux-gnu/libtinfo.so.6 /lib/x86_64-linux-gnu/libtinfo.so.5 && \
    sed -i 's/rdi::x11_workaround/#rdi::x11_workaround/' /tools/Xilinx/Vivado/2020.2/lib/scripts/rdi/features/base/base.tcl
