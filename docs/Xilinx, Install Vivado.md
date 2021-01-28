# Install Xilinx Vivado 2020.2

## Manually

Download the web installer (`Xilinx_Unified_2020.2_<DATE>_Lin64.bin`) from [https://www.xilinx.com/support/download/index.html/content/xilinx/en/downloadNav/vivado-design-tools/2020-2.html](https://www.xilinx.com/support/download/index.html/content/xilinx/en/downloadNav/vivado-design-tools/2020-2.html). Open a terminal as root with `sudo -i`. Navigate to the folder which contains the Web Installer and make it executable.

```bash
chmod a+x ./Xilinx_Unified_Lin64.bin
```

Next, extract the Web Installer to the `./Xilinx` directory.

```bash
./Xilinx_Unified_Lin64.bin --keep --noexec --target ./Xilinx
```

The generated install configuration file at `/root/.Xilinx/install_config.txt` should look similar to the below

```ini
## Shortcuts and File associations ##
# Choose whether Start menu/Application menu shortcuts will be created or not.
CreateProgramGroupShortcuts=1

# Choose the name of the Start menu/Application menu shortcut. This setting wil>
ProgramGroupFolder=Xilinx Design Tools

# Choose whether shortcuts will be created for All users or just the Current us>
CreateShortcutsForAllUsers=0

# Choose whether shortcuts will be created on the desktop or not.
CreateDesktopShortcuts=1

# Choose whether file associations will be created or not.
CreateFileAssociation=1

# Choose whether disk usage will be optimized (reduced) after installation
EnableDiskUsageOptimization=1
```

Next, acquire an authentication token. Do so by navigating to the `./Xilinx` directory and run `xsetup`. The default location for the authentication token is `/root/.Xilinx/wi_authentication_key`.

```bash
./xsetup -b AuthTokenGen
```

Enter e-mail address and password when asked for. Next, download and install Vivado with

```bash
./xsetup -b Install -a XilinxEULA,3rdPartyEULA,WebTalkTerms -c /root/.Xilinx/install_config.txt
```

By default Xilinx Vivado and other tools will be installed in `/tools/xilinx/vivado/` and `/tools/xilinx/`, respectively.

## Script (not tested)

Open a terminal as root with `sudo -i`.

Download the web installer from [https://www.xilinx.com/support/download/index.html/content/xilinx/en/downloadNav/vivado-design-tools/2020-2.html](https://www.xilinx.com/support/download/index.html/content/xilinx/en/downloadNav/vivado-design-tools/2020-2.html) and the authentication token generator script (`AuthTokenGen.exp`) from [https://github.com/KusinVitamin/Projekt-Hemsida/blob/main/Vivado/installation/AuthTokenGen.exp](https://github.com/KusinVitamin/Projekt-Hemsida/blob/main/Vivado/installation/AuthTokenGen.exp). The two files must be saved in the same folder.

```bash
# Required files:
# 	Xilinx_Unified_Lin64.bin		Web Installer
# 	AuthTokenGen.exp				Authentication token generator, credentials must be set inside of file

# Prepare
apt install expect -y
apt install gcc -y
chmod a+x ./Xilinx_Unified_Lin64.bin
mkdir Xilinx

# Install
./Xilinx_Unified_Lin64.bin --keep --noexec --target ./Xilinx
./AuthTokenGen.exp
./Xilinx/xsetup -b Install -a XilinxEULA,3rdPartyEULA,WebTalkTerms -c /root/.Xilinx/install_config.txt

# Cleanup
rm ./Xilinx_Unified_Lin64.bin
rm ./AuthTokenGen.exp
rm -r ./Xilinx

# Setup
link /lib/x86_64-linux-gnu/libtinfo.so.6 /lib/x86_64-linux-gnu/libtinfo.so.5
echo 'XILINX_VIVADO="/tools/Xilinx/Vivado/2020.2/"' >> /etc/environment
```
