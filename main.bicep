param location string = resourceGroup().location
param environmentName string = take(uniqueString(resourceGroup().id, 'prod'), 8)
param storageAccountName string = 'storageacc${environmentName}'
param appName string = 'app${environmentName}'
param dbServer string = 'mysqlserver${environmentName}'
param dbName string = 'mysqldb${environmentName}'
param openAiServiceName string = 'openAi${environmentName}'

param tags object = {
  createdBy: 'Mudasir Alam'
  'creator email': 'mualam1@empirictech.com'
  Environment: 'Prod'
}

// Blob service starts from here
resource storageAccount 'Microsoft.Storage/storageAccounts@2021-08-01' = {
  name: storageAccountName
  location: location
  tags: tags
  sku: {
    name: 'Standard_LRS'
  }
  kind: 'StorageV2'
  properties: {
    defaultToOAuthAuthentication: false
    publicNetworkAccess: 'Enabled'
    allowCrossTenantReplication: false
    minimumTlsVersion: 'TLS1_2'
    allowBlobPublicAccess: true
    allowSharedKeyAccess: true
    networkAcls: {
      bypass: 'AzureServices'
      defaultAction: 'Allow'
    }
    supportsHttpsTrafficOnly: true
    encryption: {
      requireInfrastructureEncryption: false
      services: {
        file: {
          keyType: 'Account'
          enabled: true
        }
        blob: {
          keyType: 'Account'
          enabled: true
        }
      }
      keySource: 'Microsoft.Storage'
    }
    accessTier: 'Hot'
  }
}

resource blobService 'Microsoft.Storage/storageAccounts/blobServices@2021-08-01' = {
  parent: storageAccount
  name: 'default'
  properties: {
    containerDeleteRetentionPolicy: {
      enabled: true
      days: 7
    }
    deleteRetentionPolicy: {
      enabled: true
      days: 7
    }
  }
}

resource container 'Microsoft.Storage/storageAccounts/blobServices/containers@2021-08-01' = {
  parent: blobService
  name: 'images'
  properties: {
    immutableStorageWithVersioning: {
      enabled: false
    }
    defaultEncryptionScope: '$account-encryption-key'
    denyEncryptionScopeOverride: false
    publicAccess: 'Blob'
  }
}

// Blob service concluded

// Azure Communication Services for Email
param acs_dataLocation string = 'United States'
param acs_location string = 'global'

resource communicationServices 'Microsoft.Communication/communicationServices@2023-06-01-preview' = {
  name: 'cmsc-${environmentName}'
  dependsOn: [emailServicesDomain]
  location: acs_location
  tags: tags
  properties: {
    dataLocation: acs_dataLocation
    linkedDomains: [
      '${emailServices.id}/domains/AzureManagedDomain'
    ]
  }
}

resource emailServices 'Microsoft.Communication/emailServices@2023-06-01-preview' = {
  name: 'ems-${environmentName}'
  location: acs_location
  tags: tags
  properties: {
    dataLocation: acs_dataLocation
  }
}

resource emailServicesDomain 'Microsoft.Communication/emailServices/domains@2023-06-01-preview' = {
  name: 'AzureManagedDomain'
  location: 'global'
  tags: tags
  parent: emailServices
  properties: {
    domainManagement: 'AzureManaged'
    userEngagementTracking: 'Disabled'
  }
}

// End of Azure Communication Services for Email

// App service starts from here

resource appServicePlan 'Microsoft.Web/serverfarms@2021-02-01' = {
  name: '${appName}-plan'
  location: location
  sku: {
    name: 'S2'
    tier: 'Standard'
  }
  properties: {
    reserved: true
  }
  kind: 'linux'
}

var storageConnectionString = 'DefaultEndpointsProtocol=https;AccountName=${storageAccount.name};EndpointSuffix=${environment().suffixes.storage};AccountKey=${storageAccount.listKeys().keys[0].value}'

resource webApp 'Microsoft.Web/sites@2021-02-01' = {
  name: appName
  location: location
  tags: tags
  properties: {
    serverFarmId: appServicePlan.id
    httpsOnly: true
    siteConfig: {
      linuxFxVersion: 'NODE|18-lts'
      alwaysOn: true
      appCommandLine: 'npm start'
      appSettings: [
        {
          name: 'ACS_CONNECTION_STRING'
          value: communicationServices.listKeys().primaryConnectionString
        }
        {
          name: 'ACS_SENDER_ADDRESS'
          value: 'DoNotReply@${emailServicesDomain.properties.fromSenderDomain}'
        }
        {
          name: 'AZURE_BLOB_CONNECTION_STRING'
          value: storageConnectionString
        }
        {
          name: 'AZURE_BLOB_CONTAINER'
          value: 'images'
        }

        {
          name: 'AZURE_OPENAI_API_DEPLOYMENT_NAME'
          value: 'gpt3516k'
        }
        {
          name: 'AZURE_OPENAI_API_INSTANCE_NAME'
          value: openAiServiceName
        }
        {
          name: 'AZURE_OPENAI_API_KEY'
          value: openai.listKeys().key1
        }
        {
          name: 'AZURE_OPENAI_API_VERSION'
          value: '2024-02-15-preview'
        }
        {
          name: 'AZURE_OPENAI_DEPLOYMENT'
          value: 'https://${openAiServiceName}.openai.azure.com/openai/deployments/gpt3516k/chat/completions?api-version=2024-02-15-preview'
        }
        {
          name: 'AZURE_STORAGE_ACCOUNT'
          value: storageAccountName
        }
        {
          name: 'BASE_DOMAIN'
          value: 'https://${appName}.azurewebsites.net'
        }
        {
          name: 'CURRENCY'
          value: '$'
        }
        {
          name: 'DB'
          value: dbName
        }
        {
          name: 'DB_HOST'
          value: '${dbServer}.mysql.database.azure.com'
        }
        {
          name: 'DB_PASSWORD'
          value: '@pewpew123!'
        }
        {
          name: 'DB_USERNAME'
          value: 'admin_smartserve360_mysql_server'
        }
        {
          name: 'NODE_ENV'
          value: 'production'
        }
        {
          name:'ORG_NAME'
          value:'SMARTSERVE360'
        }
        {
          name: 'SALES_TAX'
          value: '13'
        }
        {
          name:'WEBSITE_RUN_FROM_PACKAGE'
          value:'https://smartserve360sa.blob.core.windows.net/builds/smartserve360-lts.zip'
        }
      ]
      nodeVersion: '18'
    }
  }
}

// App Service concludes here

// Database starts from here

resource mysqlServer 'Microsoft.DBforMySQL/flexibleServers@2023-06-30' = {
  name: dbServer
  location: location
  sku: {
    name: 'Standard_B1s'
    tier: 'Burstable'
  }
  properties: {
    administratorLogin: 'admin_smartserve360_mysql_server'
    administratorLoginPassword: '@pewpew123!'
    version: '5.7'
    storage: {
      storageSizeGB: 20
    }
    network: {
      publicNetworkAccess: 'Enabled'
    }
  }
}

resource mysqlDatabase 'Microsoft.DBforMySQL/flexibleServers/databases@2023-06-30' = {
  parent: mysqlServer
  name: dbName
  properties: {
    charset: 'utf8'
    collation: 'utf8_general_ci'
  }
}

resource mySqlFirewallRule 'Microsoft.DBforMySQL/flexibleServers/firewallRules@2023-06-30' = {
  name: 'AllowAllAzureServicesAndResourcesWithinAzureIps_2024-4-24_13-10-12'
  parent: mysqlServer
  properties: {
    startIpAddress: '0.0.0.0'
    endIpAddress: '0.0.0.0'
  }
}

resource mySqlServerConfiguration 'Microsoft.DBforMySQL/flexibleServers/configurations@2023-06-30' = {
  name: 'require_secure_transport'
  parent:mysqlServer
  properties: {
    value: 'OFF'
    currentValue: 'OFF'
    source: 'user-override'
  }
}


// Database concludes here

// core.openai.openai
resource openai 'Microsoft.CognitiveServices/accounts@2023-10-01-preview' = {
  name: openAiServiceName
  location: location
  tags: tags
  sku: {
    name: 'S0'
  }
  kind: 'OpenAI'
  properties: {
    customSubDomainName: openAiServiceName
    networkAcls: {
      defaultAction: 'Allow'
    }
    publicNetworkAccess: 'Enabled'
  }
}

resource chat 'Microsoft.CognitiveServices/accounts/deployments@2023-10-01-preview' = {
  parent: openai
  name: 'gpt3516k'
  sku: {
    name: 'Standard'
    capacity: 60
  }
  properties: {
    model: {
      format: 'OpenAI'
      name: 'gpt-35-turbo-16k'
      version: '0613'
    }
    versionUpgradeOption: 'OnceNewDefaultVersionAvailable'
    currentCapacity: 60
    raiPolicyName: 'Microsoft.Default'
  }
}

// core openai concludes here
