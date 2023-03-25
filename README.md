# Azure AAD and OneDrive Demo

## Setup node.js project

~~~bash
npm init
npm install @azure/identity @microsoft/microsoft-graph-client isomorphic-fetch readline-sync
~~~

## Setup AAD App Registration

~~~ bash
prefix=cptdazaadonedrive
location=westeurope
myip=$(curl ifconfig.io) # Just in case we like to whitelist our own ip.
myobjectid=$(az ad user list --query '[?displayName==`ga`].id' -o tsv) 
~~~

# Add an Claim to the AAD Token

Links
- https://learn.microsoft.com/en-us/azure/active-directory/develop/custom-extension-overview
- https://learn.microsoft.com/en-us/azure/active-directory/develop/howto-add-app-roles-in-azure-ad-apps


## MISC

### Azure Bastion

~~~bash
# create bastion
az network public-ip create --sku Standard -g $prefix -n $prefix --dns-name $prefix --allocation-method Static
az network bastion create -n $prefix --public-ip-address $prefix -g $prefix --vnet-name $vnetname --enable-ip-connect true --enable-tunneling true -l $location

az network bastion delete -n $prefix -g $rg
az network public-ip delete -g $rg -n $prefix
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
git status
git add .gitignore
git add *
git commit -m"init"
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