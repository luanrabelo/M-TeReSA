<p align="center">
<a href="https://www.buymeacoffee.com/lprabelo">
<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/8b/Eucalyp-Deus_Coffee.png/640px-Eucalyp-Deus_Coffee.png" width="10%">
<br>
Did you like my scripts? So, please, buy me a coffee to keep me working on it..
</a>
</p>


<h2><p align="center">Manual <i>M-TeReSA</i> v1.0</p></h2>

<p align="center">
  <img src="https://github.com/luanrabelo/M-TeReSA/blob/stable/assets/M-TeReSA.png" width="75%" title="hover text">
</p>

# Installation  

*M-TeReSA* requires the installation of **Node.JS** for its execution. Both *M-TeReSA* and **Node.JS** are cross-platforms and can be executed with the same script `M-TeReSA.js` on any operating system compatible with **Node.JS**.  

Table 1 outlines how **Node.JS** can be installed on the operating system of the user.  

The user can download the **Node.JS** version specific for their operating system at https://nodejs.org/en/download/, according to the recommendations in Table 1.  
<br/>  

<div align="center">
<table>
<thead>
<tr>
<th style="text-align:center">OS</th>
<th style="text-align:center">Architecture</th>
<th style="text-align:center">Recommended</th>
</tr>
</thead>
<tbody>
<tr>
<td style="text-align:center">Windows</td>
<td style="text-align:center">32 bits / 64 bit</td>
<td style="text-align:center">Recommended (64 bits) (Intel/AMD)</td>
</tr>
<tr>
<td style="text-align:center">MacOS</td>
<td style="text-align:center">64 bits / ARM64</td>
<td style="text-align:center">Recommended (ARM64) (M1)</td>
</tr>
<tr>
<td style="text-align:center">Linux</td>
<td style="text-align:center">64 bits</td>
<td style="text-align:center">Recommended (64 bit) (Intel/AMD)</td>
</tr>
<tr>
<td style="text-align:center">Docker</td>
<td style="text-align:center">ARM/ARM64/32bits/64 bits</td>
<td style="text-align:center"><b>Recommended for Experts Users</b></td>
</tr>
</tbody>
</table>
<caption><i>Table 1. Recommended versions for installing Node.JS on each Operating System.</i></caption>
</div>  
<br/>  

**Figure 1** shows the **Node.JS** download page. By clicking on the chosen version, the download will begin.  
<br/>  

<p align="center"><img src="https://github.com/luanrabelo/M-TeReSA/blob/stable/assets/Figure1.png" width="100%" title="Figure 1"><b>Figure 1.</b> Node.JS download. Here, the user can download the Node.JS installation file by following the recommendations in <b>Table 1</b>.</p>  
<br/>  

- <h3>Windows</h3>  
Installation on **Windows** follows the standard installation of programs on this operation system. However, the user must pay attention to the step shown in **Figure 2**. Here, the user must check the option to install the necessary tools for the proper functioning of *Node.JS*. After installation, the console will open and several tools will be downloaded and installed **(Figure 2)**. It is important to note that, this step requires an internet connection **(Figure 3)**. At the end, restart your PC.  
<br/>  

<p align="center"><img src="https://github.com/luanrabelo/M-TeReSA/blob/stable/assets/Figure2.png" width="100%" title="Figure 2"><b>Figure 2.</b> Node.JS installation. Check the option for installing the required tools for the proper execution of Node.JS.</p>  
<br/>  

<p align="center"><img src="https://github.com/luanrabelo/M-TeReSA/blob/stable/assets/Figure3.png" width="100%" title="Figure 3"><b>Figure 3.</b> After installation <b>(Figure 2)</b>, the console is opened, and several tools are installed.</p>  
<br/>  

- <h3>MacOS</h3>  

On MacOS, after clicking the link, downloading, and executing the installation file, accept the installation terms and select the destination folder. After clicking install, enter the user password and wait. If the installation is successful, a message similar to that in **Figure** 4 will appear.  
<br/>  

<p align="center"><img src="https://github.com/luanrabelo/M-TeReSA/blob/stable/assets/Figure4.png" width="100%" title="Figure 4"><b>Figure 4.</b> Installation on MacOS.</p>  
<br/>  

- <h3>Linux</h3>

On Linux, Ubuntu will be used for installing *Node.JS*. If another operating system based on Linux is used, see the detailed documentation in the *Node.JS* repository on github at https://github.com/nodesource/distributions/blob/master/README.md.  

On Ubuntu, open the console, type and execute the command `sudo apt install nodejs`, enter the user password and wait. After the installation is complete, the NPM package manager must be installed.  

For this installation, type and execute the command `sudo apt install npm` enter the user password and wait. For simplification purposes, a single command can be used to install both Node.JS and NPM.  

For such installation, type and execute the command `sudo apt install nodejs npm` **(Figure 5)**.  
<br/>  

<p align="center"><img src="https://github.com/luanrabelo/M-TeReSA/blob/stable/assets/Figure5.png" width="100%" title="Figure 5"><b>Figure 5.</b> Linux console with command for installing Node.JS and NPM.</p>  
<br/>  

# Node.JS

On any operating system, check whether Node.JS has been correctly installed by opening the system console and typing `node` A message similar to that in **Figure 6** will appear. Otherwise, reinstall Node.JS following the operating system’s recommendations (sections Windows, MacOS or Linux).  
<br/>  

<p align="center"><img src="https://github.com/luanrabelo/M-TeReSA/blob/stable/assets/Figure6.png" width="100%" title="Figure 6"><b>Figure 6.</b> Node.JS screen showing a welcome message, Node version, and a field to enter the commands to be executed.</p>  
<br/>  

# Executing M-TeReSA  

  - <h3>Downloading <i>M-TeReSA</i></h3>  

*M-TeReSA* (v1.0) can be downloaded from its github repository at https://github.com/luanrabelo/M-TeReSA/releases.  

The zip file contains:  
  - The script `M-TeReSA.js`; 
  - The Tandem Repeats Finder tool (Windows, Linux, and MacOS); 
  - and an example input file (example.txt) with data obtained from Shan et al. (2021).  

The example file can either be used as an example for executing *M-TeReSA* or a template for creating a new input file.  

  - <h3>Input File</h3> 

First, an input txt file to be used in *M-TeReSA* must be created. This file must contain vouchers for mitochondrial genomes deposited at the NCBI (National Center for Biotechnology Information). It is important to note that, the input file must contain only vouchers and line breaks; any extra character or white space will cause an error when obtaining the genome information. The accession numbers must also correspond to mitogenomes containing the control region. Examples are shown below.  

<div align="center">
<table>
<thead>
<tr>
<th style="text-align:center">(a) KJ397613</th>
<th style="text-align:center">(b) KJ397613.</th>
<th style="text-align:center">(C) KJ_397613</th>
</tr>
</thead>
</table>
</div>  

In the example above, disregard the *"_"*. As examples (b) and (c) have characters manually added by the user, the vouchers with these characters will not be found when searching for the genome information on NCBI.  

Many authors, possibly for aesthetic reasons, remove the character *"_"* from their vouchers, tables, and published studies.  

Obtaining such data without a previous review may cause errors, not just in *M-TeReSA*, but any other tool that uses vouchers as an input.  

Overall, **DO NOT DELETE THE CHARACTERS IN YOUR VOUCHERS, AND DATA OBTAINED FROM OTHER STUDIES MUST BE REVIEWED.**  

The user can (and should) use the example.txt file (in the zip file obtained from github) as a template for creating a new input file. After the input file is prepared, *M-TeReSA* can be executed.  

  - <h3>Execution</h3>  

If this is the user’s first time executing *M-TeReSA* on their computer, some additional packages may need to be installed.  

*M-TeReSA* contains some modules for the installation of these packages. If the packages are installed before the first execution, the probability of errors caused by the packages is close to 0.  

Open the operating system's console, copy the command below into the console and press enter to install the necessary packages. The installation is very quick, but requires an internet connection.  

`npm install fs https process child_process html-to-text`  

After installation, the script *M-TeReSA.js* can be executed. With the console still open, navigate to the folder where M-TeReSA was obtained.  

Two example folders in the command will be used, one for each operating system `C:/M-TeReSA` on the Windows platform and `/home/luanrabelo/M-TeReSA` on the UNIX platform). If the user’s script is in a different folder than the example, the user should adapt the command to their folder.  

For users with little experience with commands in the console, an alternative involves navigation to the folder. Using the system's interface, right-click while holding the SHIFT key and the option to open the folder by console will appear **(Figure 7)**.  
<br/>  

<p align="center"><img src="https://github.com/luanrabelo/M-TeReSA/blob/stable/assets/Figure7.png" width="100%" title="Figure 7"><b>Figure 7.</b> Folder containing M-TeReSA. When this folder is clicked, and then the right mouse button and the shift key are held, an option to open that folder in the console appears.</p>  
<br/>  

Following the previous steps, in the user’s console, a message similar to that in **Figure 8** should appear, informing the user of the specific folder. In the image, the console is in the C:/M-TeReSA folder and this folder contains files obtained from github.  
<br/>  

<p align="center"><img src="https://github.com/luanrabelo/M-TeReSA/blob/stable/assets/Figure8.png" width="100%" title="Figure 8"><b>Figure 8.</b> Console in the C:/M-TeReSA folder.</p>  
<br/>  

To run *M-TeReSA*, type `node` in the console to inform the console that the application to be executed is by Node.JS; `M-TeReSA.js` to inform the script to be processed by Node; and the input file, which is the file containing the genome vouchers. **Figure 9** shows the complete command.  
<br/>  

<p align="center"><img src="https://github.com/luanrabelo/M-TeReSA/blob/stable/assets/Figure9.png" width="100%" title="Figure 9"><b>Figure 9.</b> Complete command for executing M-TeReSA.</p>  
<br/>  

Before executing *M-TeReSA* on **Linux** and **MacOS**, check whether the TRF files and folder that contain the script have read, write, and execute permissions.  

Selecting enter will start the process and the user will see a message similar to that in **Figure 10**.
<br/>  

<p align="center"><img src="https://github.com/luanrabelo/M-TeReSA/blob/stable/assets/Figure10.png" width="100%" title="Figure 10"><b>Figure 10.</b> M-TeReSA being executed.</p>  
<br/>  

# Output  

After *M-TeReSA* processes all vouchers, an **HTML file** is created in the same folder where the **`M-TeReSA.js`** file and several folders are located:  

  - Consensus, containing several FASTA files, with the consensus sequences being extracted from the TRF results;
  - ControlRegion, containing several FASTA files, with the sequences of the Control Region being extracted from the Genomes files obtained from NCBI;
  - Genomes, containing several Genome XML files; and
  - Results, containing HTML files obtained from the TRF result.  

When the **M-TeReSA_Results.html** file is opened on the user’s browser of choice, a message similar to that in **Figure 11** will appear.  
<br/>  

<p align="center"><img src="https://github.com/luanrabelo/M-TeReSA/blob/stable/assets/Figure11.png" width="100%" title="Figure 11"><b>Figure 11.</b> M-TeReSA HTML output file.</p>  
<br/>  

In **Figure 11 A**, although the user can show or hide certain column(s), some columns, such as the sequence download button (Control Region, Consensus), are hidden by default for aesthetic reasons. Thus, the user must activate these columns if they want to obtain the sequences.  

In **Figure 11 B**, the user can obtain the complete table in an excel file **(Figure 12)** for manipulation (Delete or Insert new columns) in Microsoft Excel.  
<br/>  

<p align="center"><img src="https://github.com/luanrabelo/M-TeReSA/blob/stable/assets/Figure12.png" width="100%" title="Figure 12"><b>Figure 12.</b> Excel file generated with M-TeReSA.</p>  
<br/>  

# Bugs
Some bugs may be observed while executing *M-TeReSA* on some machines.  
These bugs can be easily identified and fixed. If any of these bugs occur during an analysis, check the FAQ below or refer to the specific section on GitHub:  

  - Check whether Node.JS was properly installed (See section **Windows**, **MacOS**, **Linux** for more information);
  - Check whether the NPM packages were properly installed (See section **Execution** for more information);
  - On **Linux** and **MacOS**, check whether the **TRF** files can be executed;
  - Check the Input File (See section **Input File** for more details);
  - Ensure `M-TeReSA.js` is being executed in your specific folder (See section **Execution** for more details); 
  - Check permissions for reading, writing, and executing files on your operating system (See section **Execution** for more details); and
  - Check your internet connection.

If any of the errors mentioned above occur, the **`M-TeReSA_Results.html`** file must be deleted as the execution result will be written in this file.  

In errors occur the next time *M-TeReSA* is executed, the information will be duplicated/broken in the output file, making it difficult to understand the information.  

It is important to note that, if **`M-TeReSA.js`** must be executed with other data (Input File), **`M-TeReSA_Results.html`** and the folders generated during the last execution must be deleted; otherwise, data from the new and old executions will be overwritten.
