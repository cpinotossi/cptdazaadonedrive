# Azure FileSync Demo

## Setup project

~~~bash
npm init
npm install @azure/identity @microsoft/microsoft-graph-client isomorphic-fetch readline-sync
~~~
## Azure FileSync basic setup

https://aka.ms/afs/agent

Requirements:
- On-prem windows file server (OS >= 20212)
- Azure file sync agent
- Port 443
- Azure file share

### Setup Env:

~~~ bash
az extension add --name storagesync
prefix=cptdazaadonedrive
dcvmname=dc-01-win-vm
dcrg=file-rg
dcvnetname=file-rg-vnet
location=westeurope
myip=$(curl ifconfig.io) # Just in case we like to whitelist our own ip.
myobjectid=$(az ad user list --query '[?displayName==`ga`].id' -o tsv) 
~~~

### Deploy resources

TODO: Need to fix pwsh installation of azure filesync via deploymentscript resource inside bicep.

~~~bash
# az group delete -n $prefix --yes
az group create -n $prefix -l $location
az deployment group create -n $prefix -g $prefix --mode incremental --template-file deploy.bicep -p prefix=$prefix myobjectid=$myobjectid location=$location myip=$myip
~~~

### Create Bastion in DC Vnet

~~~bash
# create bastion
az network public-ip create --sku Standard -g $dcrg -n $prefix --dns-name $prefix --allocation-method Static
az network bastion create -n $prefix --public-ip-address $prefix -g $dcrg --vnet-name $dcvnetname --enable-ip-connect true --enable-tunneling true -l $location
~~~

### Upload file to fileshare

~~~bash
az storage directory create --account-name $prefix -s $prefix --name "batman"
az storage file upload -s $prefix --source batman.txt --metadata env=test -p batman/batman.txt --account-name $prefix
az storage directory create --account-name $prefix -s $prefix --name "spiderman"
az storage file upload -s $prefix --source batman.txt --metadata env=test -p spiderman/spiderman.txt --account-name $prefix

az storage file list -s $prefix --account-name $prefix -o table
az storage file list -p batman -s $prefix --account-name $prefix -o table
az storage file list -p spiderman -s $prefix --account-name $prefix -o table
~~~

### TODO

Get it done with resource script instead like here:
https://github.com/Azure/azure-quickstart-templates/blob/master/quickstarts/microsoft.storage/storage-static-website/scripts/enable-static-website.ps1

[Bicep Script Resource](https://docs.microsoft.com/en-us/azure/templates/microsoft.resources/deploymentscripts?tabs=bicep)


## MISC

### Azure Bastion

~~~bash
# create bastion
az network public-ip create --sku Standard -g $prefix -n $prefix --dns-name $prefix --allocation-method Static
az network bastion create -n $prefix --public-ip-address $prefix -g $prefix --vnet-name $vnetname --enable-ip-connect true --enable-tunneling true -l $location

az network bastion delete -n $prefix -g $rg
az network public-ip delete -g $rg -n $prefix
~~~

### VNet DNS
~~~bash
# retrieve dns ip from dcvnet
dcdnsip=$(az network vnet show -n $dcvnetname -g $dcrg --query dhcpOptions.dnsServers[0] -o tsv)
~~~

### change chmod at wsl
Based on 
- https://stackoverflow.com/questions/46610256/chmod-wsl-bash-doesnt-work
- https://devblogs.microsoft.com/commandline/automatically-configuring-wsl/
~~~bash
sudo cat /etc/wsl.conf
sudo touch /etc/wsl.conf
sudo nano /etc/wsl.conf
~~~

Add
~~~ text
[automount]
options = "metadata"
~~~

### github
~~~ bash
gh repo create $prefix --public
git init
git remote remove origin
git remote add origin https://github.com/cpinotossi/$prefix.git
git submodule add https://github.com/cpinotossi/azbicep
git submodule init
git submodule update
git submodule update --init
git status
git add .gitignore
git add *
git commit -m"azure frontdoor private link demo update cptdazfd"
git push origin main
git push --recurse-submodules=on-demand
git rm README.md # unstage
git --help
git config advice.addIgnoredFile false
git pull origin main
git merge 
origin main
git config pull.rebase false
~~~