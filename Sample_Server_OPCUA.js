[
    {
        "id": "540b412a.76eab",
        "type": "tab",
        "label": "OPCUA Server",
        "disabled": false,
        "info": ""
    },
    {
        "id": "aa4c454d.2bb208",
        "type": "inject",
        "z": "540b412a.76eab",
        "name": "",
        "topic": "ns=1;s=Variable1;datatype=Double",
        "payload": "",
        "payloadType": "date",
        "repeat": "",
        "crontab": "",
        "once": false,
        "onceDelay": 0.1,
        "x": 120,
        "y": 180,
        "wires": [
            [
                "b7581c2d.497dd"
            ]
        ]
    },
    {
        "id": "b7581c2d.497dd",
        "type": "OpcUa-Client",
        "z": "540b412a.76eab",
        "endpoint": "a6463b49.678438",
        "action": "read",
        "deadbandtype": "a",
        "deadbandvalue": 1,
        "time": 10,
        "timeUnit": "s",
        "certificate": "n",
        "localfile": "",
        "securitymode": "None",
        "securitypolicy": "None",
        "name": "",
        "x": 360,
        "y": 180,
        "wires": [
            [
                "cfcde0e6.33b6"
            ]
        ]
    },
    {
        "id": "cfcde0e6.33b6",
        "type": "debug",
        "z": "540b412a.76eab",
        "name": "",
        "active": false,
        "tosidebar": true,
        "console": false,
        "tostatus": false,
        "complete": "false",
        "x": 600,
        "y": 180,
        "wires": []
    },
    {
        "id": "9a2f3659.68ab58",
        "type": "inject",
        "z": "540b412a.76eab",
        "name": "",
        "topic": "ns=1;s=Variable1;datatype=Double",
        "payload": "67",
        "payloadType": "num",
        "repeat": "",
        "crontab": "",
        "once": false,
        "onceDelay": 0.1,
        "x": 110,
        "y": 240,
        "wires": [
            [
                "ed83cd98.90f67"
            ]
        ]
    },
    {
        "id": "c46b8f2a.942ce",
        "type": "inject",
        "z": "540b412a.76eab",
        "name": "",
        "topic": "ns=1;s=Variable1;datatype=Double",
        "payload": "22",
        "payloadType": "num",
        "repeat": "",
        "crontab": "",
        "once": false,
        "onceDelay": 0.1,
        "x": 110,
        "y": 280,
        "wires": [
            [
                "ed83cd98.90f67"
            ]
        ]
    },
    {
        "id": "ed83cd98.90f67",
        "type": "OpcUa-Client",
        "z": "540b412a.76eab",
        "endpoint": "a6463b49.678438",
        "action": "write",
        "deadbandtype": "a",
        "deadbandvalue": 1,
        "time": 10,
        "timeUnit": "s",
        "certificate": "n",
        "localfile": "",
        "securitymode": "None",
        "securitypolicy": "None",
        "name": "",
        "x": 360,
        "y": 260,
        "wires": [
            [
                "7af62b4.26d17d4"
            ]
        ]
    },
    {
        "id": "44d9ba30.bc70f4",
        "type": "OPCUA-IIoT-Flex-Server",
        "z": "540b412a.76eab",
        "port": "55380",
        "endpoint": "",
        "acceptExternalCommands": true,
        "maxAllowedSessionNumber": "",
        "maxConnectionsPerEndpoint": "",
        "maxAllowedSubscriptionNumber": "",
        "alternateHostname": "",
        "name": "",
        "showStatusActivities": false,
        "showErrors": false,
        "allowAnonymous": true,
        "individualCerts": false,
        "isAuditing": false,
        "serverDiscovery": true,
        "users": [],
        "xmlsets": [],
        "publicCertificateFile": "",
        "privateCertificateFile": "",
        "registerServerMethod": 1,
        "discoveryServerEndpointUrl": "",
        "capabilitiesForMDNS": "",
        "maxNodesPerRead": 1000,
        "maxNodesPerBrowse": 2000,
        "delayToClose": 1000,
        "addressSpaceScript": "function constructAlarmAddressSpace(server, addressSpace, eventObjects, done) {\n    // server = the created node-opcua server\n    // addressSpace = script placeholder\n    // eventObjects = to hold event variables in memory from this script\n    \n    // internal global sandbox objects are \n    // node = node of the flex server, \n    // coreServer = core iiot server object for debug and access to nodeOPCUA,\n    // and scriptObjects to hold variables and functions\n    const LocalizedText = coreServer.core.nodeOPCUA.LocalizedText\n    const namespace = addressSpace.getOwnNamespace()\n\n    coreServer.internalDebugLog('init dynamic address space')\n    node.warn('construct new address space for OPC UA')\n    \n    // from here - see the node-opcua docs how to build address sapces\n    let tanks = namespace.addObject({\n        browseName: 'Tanks',\n        description: 'The Object representing some tanks',\n        organizedBy: addressSpace.rootFolder.objects,\n        notifierOf: addressSpace.rootFolder.objects.server\n    })\n    \n    let oilTankLevel = namespace.addVariable({\n        browseName: 'OilTankLevel',\n        displayName: [\n          new LocalizedText({text: 'Oil Tank Level', locale: 'en-US'}),\n          new LocalizedText({text: 'Öl Tank Füllstand', locale: 'de-DE'})\n        ],\n        description: 'Fill level in percentage (0% to 100%) of the oil tank',\n        propertyOf: tanks,\n        dataType: 'Double',\n        eventSourceOf: tanks\n    })\n    \n    // ---------------------------------------------------------------------------------\n    // Let's create a exclusive Limit Alarm that automatically raise itself\n    // when the tank level is out of limit\n    // ---------------------------------------------------------------------------------\n    let exclusiveLimitAlarmType = addressSpace.findEventType('ExclusiveLimitAlarmType')\n    node.bianco.iiot.assert(exclusiveLimitAlarmType !== null)\n    \n    let oilTankLevelCondition = namespace.instantiateExclusiveLimitAlarm(exclusiveLimitAlarmType, {\n        componentOf: tanks,\n        conditionSource: oilTankLevel,\n        browseName: 'OilTankLevelCondition',\n        displayName: [\n          new LocalizedText({text: 'Oil Tank Level Condition', locale: 'en-US'}),\n          new LocalizedText({text: 'Öl Tank Füllstand Bedingung', locale: 'de-DE'})\n        ],\n        description: 'ExclusiveLimitAlarmType Condition',\n        conditionName: 'OilLevelCondition',\n        optionals: [\n          'ConfirmedState', 'Confirm' // confirm state and confirm Method\n        ],\n        inputNode: oilTankLevel,   // the letiable that will be monitored for change\n        highHighLimit: 0.9,\n        highLimit: 0.8,\n        lowLimit: 0.2\n    })\n    \n    // --------------------------------------------------------------\n    // Let's create a second letiable with no Exclusive alarm\n    // --------------------------------------------------------------\n    let gasTankLevel = namespace.addVariable({\n        browseName: 'GasTankLevel',\n        displayName: [\n          new LocalizedText({text: 'Gas Tank Level', locale: 'en-US'}),\n          new LocalizedText({text: 'Gas Tank Füllstand', locale: 'de-DE'})\n        ],\n        description: 'Fill level in percentage (0% to 100%) of the gas tank',\n        propertyOf: tanks,\n        dataType: 'Double',\n        eventSourceOf: tanks\n    })\n    \n    let nonExclusiveLimitAlarmType = addressSpace.findEventType('NonExclusiveLimitAlarmType')\n    node.bianco.iiot.assert(nonExclusiveLimitAlarmType !== null)\n    \n    let gasTankLevelCondition = namespace.instantiateNonExclusiveLimitAlarm(nonExclusiveLimitAlarmType, {\n        componentOf: tanks,\n        conditionSource: gasTankLevel,\n        browseName: 'GasTankLevelCondition',\n        displayName: [\n          new LocalizedText({text: 'Gas Tank Level Condition', locale: 'en-US'}),\n          new LocalizedText({text: 'Gas Tank Füllstand Bedingung', locale: 'de-DE'})\n        ],\n        description: 'NonExclusiveLimitAlarmType Condition',\n        conditionName: 'GasLevelCondition',\n        optionals: [\n          'ConfirmedState', 'Confirm' // confirm state and confirm Method\n        ],\n        inputNode: gasTankLevel,   // the letiable that will be monitored for change\n        highHighLimit: 0.9,\n        highLimit: 0.8,\n        lowLimit: 0.2\n    })\n    \n    \n    // Initial conditions for Node-RED variables with value---------------------------------------------\n    \n    if(scriptObjects.Variable1 === undefined || scriptObjects.Variable1 === null) {\n            scriptObjects.Variable1 = 0.0\n    }\n    \n        if(scriptObjects.Variable2 === undefined || scriptObjects.Variable2 === null) {\n            scriptObjects.Variable2 = 0.0\n    }\n    \n            if(scriptObjects.Variable3 === undefined || scriptObjects.Variable3 === null) {\n            scriptObjects.Variable3 = false\n    }\n    \n\t    \n    // Initial conditions for Delta PLC variables with value---------------------------------------------\n    \n    if(scriptObjects.D0 === undefined || scriptObjects.D0 === null) {\n            scriptObjects.D0 = 0\n\t}\n\tif(scriptObjects.D1 === undefined || scriptObjects.D1 === null) {\n            scriptObjects.D1 = 0\n\t\t}\n\t\t\n\tif(scriptObjects.M0 === undefined || scriptObjects.M0 === null) {\n            scriptObjects.M0 = false\n\t\t}\n\t\t\n\tif(scriptObjects.Y0 === undefined || scriptObjects.Y0 === null) {\n            scriptObjects.Y0 = false\n\t\t}\n\t\n\t\n\t    // Initial conditions for Arduino variables with value---------------------------------------------\n    \n    if(scriptObjects.A0 === undefined || scriptObjects.A0 === null) {\n            scriptObjects.A0 = 0.0\n\t}\n\tif(scriptObjects.A1 === undefined || scriptObjects.A1 === null) {\n            scriptObjects.A1 = 0.0\n\t\t}\n\t\t\n\tif(scriptObjects.Pin2 === undefined || scriptObjects.Pin2 === null) {\n            scriptObjects.Pin2 = false\n\t\t}\n\t\t\n\tif(scriptObjects.Pin3 === undefined || scriptObjects.Pin3 === null) {\n            scriptObjects.Pin3 = 0\n\t\t}\n\t\n\t\n\t\n    //Creating objects in the OPC UA server------------------------------------------------\n    \n    let myVariable1 = namespace.addObject({\n        browseName: 'Node-RED variables',\n        description: 'The Object representing some variables',\n        organizedBy: addressSpace.rootFolder.objects,\n        notifierOf: addressSpace.rootFolder.objects.server\n    })\n    \n\t  let myVariable2 = namespace.addObject({\n        browseName: 'Delta PLC variables',\n        description: 'The Object representing some variables',\n        organizedBy: addressSpace.rootFolder.objects,\n        notifierOf: addressSpace.rootFolder.objects.server\n    })\n    \n\tlet myVariable3 = namespace.addObject({\n        browseName: 'Arduino variables',\n        description: 'The Object representing some variables',\n        organizedBy: addressSpace.rootFolder.objects,\n        notifierOf: addressSpace.rootFolder.objects.server\n    })\n    \n    \n    \n    // Defining tab properties for Node-RED variables-----------------------------\n    \n    if(coreServer.core) \n    {\n        \n        namespace.addVariable({\n            componentOf: myVariable1,\n            nodeId: 'ns=1;s=Node-RED.Variable1',\n            browseName: 'Node-RED.Variable1',\n            displayName: [\n                new LocalizedText({text: 'Node-RED.Variable1', locale: 'en-US'}),\n                new LocalizedText({text: 'Node-RED.Variable1', locale: 'de-DE'})\n            ],\n            dataType: 'Double',\n            value: {\n                get: function () {\n                    return new coreServer.core.nodeOPCUA.Variant({\n                        dataType: 'Double',\n                        value: scriptObjects.Variable1\n                    })\n                },\n                set: function (variant) {\n                    scriptObjects.Variable1 = parseFloat(variant.value)\n                    return coreServer.core.nodeOPCUA.StatusCodes.Good\n                }\n            }\n            \n        })\n        \n        namespace.addVariable({\n            componentOf: myVariable1,\n            nodeId: 'ns=1;s=Node-RED.Variable2',\n            browseName: 'Node-RED.Variable2',\n            displayName: [\n                new LocalizedText({text: 'Node-RED.Variable2', locale: 'en-US'}),\n                new LocalizedText({text: 'Node-RED.Variable2', locale: 'de-DE'})\n            ],\n            dataType: 'Int16',\n            value: {\n                get: function () {\n                    return new coreServer.core.nodeOPCUA.Variant({\n                        dataType: 'Int16',\n                        value: scriptObjects.Variable2\n                    })\n                },\n                set: function (variant) {\n                    scriptObjects.Variable2 = parseFloat(variant.value)\n                    return coreServer.core.nodeOPCUA.StatusCodes.Good\n                }\n            }\n            \n        })\n        \n           namespace.addVariable({\n            componentOf: myVariable1,\n            nodeId: 'ns=1;s=Node-RED.Variable3',\n            browseName: 'Node-RED.Variable3',\n            displayName: [\n                new LocalizedText({text: 'Node-RED.Variable3', locale: 'en-US'}),\n                new LocalizedText({text: 'Node-RED.Variable3', locale: 'de-DE'})\n            ],\n            dataType: 'Boolean',\n            value: {\n                get: function () {\n                    return new coreServer.core.nodeOPCUA.Variant({\n                        dataType: 'Boolean',\n                        value: scriptObjects.Variable3\n                    })\n                },\n                set: function (variant) {\n                    scriptObjects.Variable3 = variant.value\n                    return coreServer.core.nodeOPCUA.StatusCodes.Good\n                }\n            }\n            \n        })\n        \n\t\t\n\t\t// Delta PLC variables\n\t\t\n\t\t      namespace.addVariable({\n            componentOf: myVariable2,\n            nodeId: 'ns=1;s=Delta.D0',\n            browseName: 'Delta.D0',\n            displayName: [\n                new LocalizedText({text: 'Delta.D0', locale: 'en-US'}),\n                new LocalizedText({text: 'Delta.D0', locale: 'de-DE'})\n            ],\n            dataType: 'Int16',\n            value: {\n                get: function () {\n                    return new coreServer.core.nodeOPCUA.Variant({\n                        dataType: 'Int16',\n                        value: scriptObjects.D0\n                    })\n                },\n                set: function (variant) {\n                    scriptObjects.D0 = variant.value\n                    return coreServer.core.nodeOPCUA.StatusCodes.Good\n                }\n            }\n            \n        })\n\t\t\n\n\t\t\n\t\t      namespace.addVariable({\n            componentOf: myVariable2,\n            nodeId: 'ns=1;s=Delta.D1',\n            browseName: 'Delta.D1',\n            displayName: [\n                new LocalizedText({text: 'Delta.D1', locale: 'en-US'}),\n                new LocalizedText({text: 'Delta.D1', locale: 'de-DE'})\n            ],\n            dataType: 'Int16',\n            value: {\n                get: function () {\n                    return new coreServer.core.nodeOPCUA.Variant({\n                        dataType: 'Int16',\n                        value: scriptObjects.D1\n                    })\n                },\n                set: function (variant) {\n                    scriptObjects.D1 = variant.value\n                    return coreServer.core.nodeOPCUA.StatusCodes.Good\n                }\n            }\n            \n        })\n        \n        \n        \t      namespace.addVariable({\n            componentOf: myVariable2,\n            nodeId: 'ns=1;s=Delta.M0',\n            browseName: 'Delta.M0',\n            displayName: [\n                new LocalizedText({text: 'Delta.M0', locale: 'en-US'}),\n                new LocalizedText({text: 'Delta.M0', locale: 'de-DE'})\n            ],\n            dataType: 'Boolean',\n            value: {\n                get: function () {\n                    return new coreServer.core.nodeOPCUA.Variant({\n                        dataType: 'Boolean',\n                        value: scriptObjects.M0\n                    })\n                },\n                set: function (variant) {\n                    scriptObjects.M0 = variant.value\n                    return coreServer.core.nodeOPCUA.StatusCodes.Good\n                }\n            }\n            \n        })\n\t\t\n\t\t     \t      namespace.addVariable({\n            componentOf: myVariable2,\n            nodeId: 'ns=1;s=Delta.Y0',\n            browseName: 'Delta.Y0',\n            displayName: [\n                new LocalizedText({text: 'Delta.Y0', locale: 'en-US'}),\n                new LocalizedText({text: 'Delta.Y0', locale: 'de-DE'})\n            ],\n            dataType: 'Boolean',\n            value: {\n                get: function () {\n                    return new coreServer.core.nodeOPCUA.Variant({\n                        dataType: 'Boolean',\n                        value: scriptObjects.Y0\n                    })\n                },\n                set: function (variant) {\n                    scriptObjects.Y0 = variant.value\n                    return coreServer.core.nodeOPCUA.StatusCodes.Good\n                }\n            }\n            \n        })\n\t\t\n\t\t\n\t\t//Arduino variables definitions\n\t\t\n\t\tnamespace.addVariable({\n            componentOf: myVariable3,\n            nodeId: 'ns=1;s=Arduino.A0',\n            browseName: 'Arduino.A0',\n            displayName: [\n                new LocalizedText({text: 'Arduino.A0', locale: 'en-US'}),\n                new LocalizedText({text: 'Arduino.A0', locale: 'de-DE'})\n            ],\n            dataType: 'Float',\n            value: {\n                get: function () {\n                    return new coreServer.core.nodeOPCUA.Variant({\n                        dataType: 'Float',\n                        value: scriptObjects.A0\n                    })\n                },\n                set: function (variant) {\n                    scriptObjects.A0 = parseFloat(variant.value)\n                    return coreServer.core.nodeOPCUA.StatusCodes.Good\n                }\n            }\n            \n        })\n\t\t\n\t\t\tnamespace.addVariable({\n            componentOf: myVariable3,\n            nodeId: 'ns=1;s=Arduino.A1',\n            browseName: 'Arduino.A1',\n            displayName: [\n                new LocalizedText({text: 'Arduino.A1', locale: 'en-US'}),\n                new LocalizedText({text: 'Arduino.A1', locale: 'de-DE'})\n            ],\n            dataType: 'Float',\n            value: {\n                get: function () {\n                    return new coreServer.core.nodeOPCUA.Variant({\n                        dataType: 'Float',\n                        value: scriptObjects.A1\n                    })\n                },\n                set: function (variant) {\n                    scriptObjects.A1 = parseFloat(variant.value)\n                    return coreServer.core.nodeOPCUA.StatusCodes.Good\n                }\n            }\n            \n        })\n\t\t\n\t\t\n\t\tnamespace.addVariable({\n            componentOf: myVariable3,\n            nodeId: 'ns=1;s=Arduino.Pin2',\n            browseName: 'Arduino.Pin2',\n            displayName: [\n                new LocalizedText({text: 'Arduino.Pin2', locale: 'en-US'}),\n                new LocalizedText({text: 'Arduino.Pin2', locale: 'de-DE'})\n            ],\n            dataType: 'Boolean',\n            value: {\n                get: function () {\n                    return new coreServer.core.nodeOPCUA.Variant({\n                        dataType: 'Boolean',\n                        value: scriptObjects.Pin2\n                    })\n                },\n                set: function (variant) {\n                    scriptObjects.Pin2 = variant.value\n                    return coreServer.core.nodeOPCUA.StatusCodes.Good\n                }\n            }\n            \n        })\n\t\t\n\t\tnamespace.addVariable({\n            componentOf: myVariable3,\n            nodeId: 'ns=1;s=Arduino.Pin3',\n            browseName: 'Arduino.Pin3',\n            displayName: [\n                new LocalizedText({text: 'Arduino.Pin3', locale: 'en-US'}),\n                new LocalizedText({text: 'Arduino.Pin3', locale: 'de-DE'})\n            ],\n            dataType: 'Int16',\n            value: {\n                get: function () {\n                    return new coreServer.core.nodeOPCUA.Variant({\n                        dataType: 'Int16',\n                        value: scriptObjects.Pin3\n                    })\n                },\n                set: function (variant) {\n                    scriptObjects.Pin3 = variant.value\n                    return coreServer.core.nodeOPCUA.StatusCodes.Good\n                }\n            }\n            \n        })\n\t\t\n\t\t\n\t\t\n\t\t\n        \n        \n        let memoryVariable = namespace.addVariable({\n            componentOf: myVariable1,\n            nodeId: 'ns=1;s=free_memory',\n            browseName: 'FreeMemory',\n            displayName: [\n                new LocalizedText({text: 'Free Memory', locale: 'en-US'}),\n                new LocalizedText({text: 'ungenutzer RAM', locale: 'de-DE'})\n            ],\n            dataType: 'Double',\n            \n            value: {\n              get: function () {\n                return new coreServer.core.nodeOPCUA.Variant({\n                  dataType: 'Double',\n                  value: coreServer.core.availableMemory()\n                })\n              }\n            }\n        })\n        addressSpace.installHistoricalDataNode(memoryVariable)\n       \n    } else {\n        coreServer.internalDebugLog('coreServer.core needed for coreServer.core.nodeOPCUA')\n    }\n\n    // hold event objects in memory \n    eventObjects.oilTankLevel = oilTankLevel\n    eventObjects.oilTankLevelCondition = oilTankLevelCondition\n    \n    eventObjects.gasTankLevel = gasTankLevel\n    eventObjects.gasTankLevelCondition = gasTankLevelCondition\n    \n    done()\n}",
        "x": 90,
        "y": 40,
        "wires": [
            []
        ]
    },
    {
        "id": "a940fbf1.9ad898",
        "type": "modbus-read",
        "z": "540b412a.76eab",
        "name": "",
        "topic": "",
        "showStatusActivities": false,
        "logIOActivities": false,
        "showErrors": false,
        "unitid": "1",
        "dataType": "HoldingRegister",
        "adr": "4096",
        "quantity": "1",
        "rate": "1",
        "rateUnit": "s",
        "delayOnStart": false,
        "startDelayTime": "",
        "server": "7e10f4e5.f87c2c",
        "useIOFile": false,
        "ioFile": "",
        "useIOForPayload": false,
        "emptyMsgOnFail": false,
        "x": 130,
        "y": 500,
        "wires": [
            [
                "8ce044d4.85c288",
                "4e526349.ad324c"
            ],
            []
        ]
    },
    {
        "id": "866fdadb.828628",
        "type": "comment",
        "z": "540b412a.76eab",
        "name": "Node-RED Variables",
        "info": "",
        "x": 110,
        "y": 120,
        "wires": []
    },
    {
        "id": "82d8c95e.f3e238",
        "type": "comment",
        "z": "540b412a.76eab",
        "name": "Delta Variables",
        "info": "",
        "x": 100,
        "y": 400,
        "wires": []
    },
    {
        "id": "8ce044d4.85c288",
        "type": "debug",
        "z": "540b412a.76eab",
        "name": "",
        "active": false,
        "tosidebar": true,
        "console": false,
        "tostatus": false,
        "complete": "false",
        "x": 350,
        "y": 500,
        "wires": []
    },
    {
        "id": "4e526349.ad324c",
        "type": "function",
        "z": "540b412a.76eab",
        "name": "To Client D0",
        "func": "msg.topic=\"ns=1;s=Delta.D0;datatype=Int16\";\nmsg.payload=msg.payload[0];\nreturn msg;",
        "outputs": 1,
        "noerr": 0,
        "x": 350,
        "y": 540,
        "wires": [
            [
                "754e3c74.a98e94"
            ]
        ]
    },
    {
        "id": "754e3c74.a98e94",
        "type": "OpcUa-Client",
        "z": "540b412a.76eab",
        "endpoint": "a6463b49.678438",
        "action": "write",
        "deadbandtype": "a",
        "deadbandvalue": 1,
        "time": 10,
        "timeUnit": "s",
        "certificate": "n",
        "localfile": "",
        "securitymode": "None",
        "securitypolicy": "None",
        "name": "",
        "x": 600,
        "y": 540,
        "wires": [
            []
        ]
    },
    {
        "id": "ae53cd35.590f9",
        "type": "modbus-write",
        "z": "540b412a.76eab",
        "name": "",
        "showStatusActivities": false,
        "showErrors": false,
        "unitid": "1",
        "dataType": "HoldingRegister",
        "adr": "4097",
        "quantity": "1",
        "server": "7e10f4e5.f87c2c",
        "emptyMsgOnFail": false,
        "keepMsgProperties": false,
        "x": 740,
        "y": 900,
        "wires": [
            [],
            []
        ]
    },
    {
        "id": "bb90d0f9.53d17",
        "type": "inject",
        "z": "540b412a.76eab",
        "name": "D1",
        "topic": "ns=1;s=Delta.D1;datatype=Int16",
        "payload": "",
        "payloadType": "date",
        "repeat": "1",
        "crontab": "",
        "once": false,
        "onceDelay": 0.1,
        "x": 110,
        "y": 800,
        "wires": [
            [
                "1fb1d3d1.5ca9cc"
            ]
        ]
    },
    {
        "id": "1fb1d3d1.5ca9cc",
        "type": "OpcUa-Client",
        "z": "540b412a.76eab",
        "endpoint": "a6463b49.678438",
        "action": "read",
        "deadbandtype": "a",
        "deadbandvalue": 1,
        "time": 10,
        "timeUnit": "s",
        "certificate": "n",
        "localfile": "",
        "securitymode": "None",
        "securitypolicy": "None",
        "name": "",
        "x": 300,
        "y": 800,
        "wires": [
            [
                "8aa4f828.e1a7e8",
                "99b9a544.3b1968",
                "2dcfb11c.2e9dbe",
                "d0f36254.1c142"
            ]
        ]
    },
    {
        "id": "c6a9c445.cf2398",
        "type": "debug",
        "z": "540b412a.76eab",
        "name": "",
        "active": false,
        "tosidebar": true,
        "console": false,
        "tostatus": false,
        "complete": "false",
        "x": 730,
        "y": 800,
        "wires": []
    },
    {
        "id": "89d2b585.4ca5f8",
        "type": "comment",
        "z": "540b412a.76eab",
        "name": "From PLC to OPC UA Server",
        "info": "",
        "x": 140,
        "y": 440,
        "wires": []
    },
    {
        "id": "a5fdbc28.c5824",
        "type": "comment",
        "z": "540b412a.76eab",
        "name": "From OPC UA Server to PLC",
        "info": "",
        "x": 140,
        "y": 740,
        "wires": []
    },
    {
        "id": "e34ee8e5.7400f8",
        "type": "inject",
        "z": "540b412a.76eab",
        "name": "M0",
        "topic": "ns=1;s=Delta.M0;datatype=Boolean",
        "payload": "",
        "payloadType": "date",
        "repeat": "1",
        "crontab": "",
        "once": false,
        "onceDelay": 0.1,
        "x": 110,
        "y": 840,
        "wires": [
            [
                "1fb1d3d1.5ca9cc"
            ]
        ]
    },
    {
        "id": "8aa4f828.e1a7e8",
        "type": "function",
        "z": "540b412a.76eab",
        "name": "M0",
        "func": "if (msg.topic == \"ns=1;s=Delta.M0\")\n{\nreturn msg;}",
        "outputs": 1,
        "noerr": 0,
        "x": 530,
        "y": 800,
        "wires": [
            [
                "c6a9c445.cf2398",
                "59c28a7a.779e44"
            ]
        ]
    },
    {
        "id": "99b9a544.3b1968",
        "type": "function",
        "z": "540b412a.76eab",
        "name": "D1",
        "func": "if (msg.topic == \"ns=1;s=Delta.D1\")\n{\nreturn msg;}",
        "outputs": 1,
        "noerr": 0,
        "x": 530,
        "y": 840,
        "wires": [
            [
                "f3339e11.4df8f",
                "ae53cd35.590f9"
            ]
        ]
    },
    {
        "id": "f3339e11.4df8f",
        "type": "debug",
        "z": "540b412a.76eab",
        "name": "",
        "active": false,
        "tosidebar": true,
        "console": false,
        "tostatus": false,
        "complete": "false",
        "x": 730,
        "y": 840,
        "wires": []
    },
    {
        "id": "59c28a7a.779e44",
        "type": "modbus-write",
        "z": "540b412a.76eab",
        "name": "",
        "showStatusActivities": false,
        "showErrors": false,
        "unitid": "1",
        "dataType": "Coil",
        "adr": "2048",
        "quantity": "1",
        "server": "7e10f4e5.f87c2c",
        "emptyMsgOnFail": false,
        "keepMsgProperties": false,
        "x": 740,
        "y": 740,
        "wires": [
            [],
            []
        ]
    },
    {
        "id": "5f40bfd.253324",
        "type": "modbus-read",
        "z": "540b412a.76eab",
        "name": "",
        "topic": "",
        "showStatusActivities": false,
        "logIOActivities": false,
        "showErrors": false,
        "unitid": "1",
        "dataType": "Coil",
        "adr": "1280",
        "quantity": "1",
        "rate": "1",
        "rateUnit": "s",
        "delayOnStart": false,
        "startDelayTime": "",
        "server": "7e10f4e5.f87c2c",
        "useIOFile": false,
        "ioFile": "",
        "useIOForPayload": false,
        "emptyMsgOnFail": false,
        "x": 130,
        "y": 580,
        "wires": [
            [
                "718744f4.974d0c",
                "d0d734e7.188de8"
            ],
            []
        ]
    },
    {
        "id": "d0d734e7.188de8",
        "type": "function",
        "z": "540b412a.76eab",
        "name": "To Client Y0",
        "func": "msg.topic=\"ns=1;s=Delta.Y0;datatype=Boolean\";\nmsg.payload=msg.payload[0];\nreturn msg;",
        "outputs": 1,
        "noerr": 0,
        "x": 350,
        "y": 620,
        "wires": [
            [
                "754e3c74.a98e94"
            ]
        ]
    },
    {
        "id": "718744f4.974d0c",
        "type": "debug",
        "z": "540b412a.76eab",
        "name": "",
        "active": false,
        "tosidebar": true,
        "console": false,
        "tostatus": false,
        "complete": "false",
        "x": 330,
        "y": 580,
        "wires": []
    },
    {
        "id": "7af62b4.26d17d4",
        "type": "debug",
        "z": "540b412a.76eab",
        "name": "",
        "active": true,
        "tosidebar": true,
        "console": false,
        "tostatus": false,
        "complete": "false",
        "x": 590,
        "y": 260,
        "wires": []
    },
    {
        "id": "8c0ef1e2.6a551",
        "type": "arduino in",
        "z": "540b412a.76eab",
        "name": "",
        "pin": "0",
        "state": "ANALOG",
        "arduino": "9255cd05.df42a",
        "x": 90,
        "y": 1280,
        "wires": [
            [
                "9423aa16.bb1d38"
            ]
        ]
    },
    {
        "id": "765fdb12.5b6fb4",
        "type": "debug",
        "z": "540b412a.76eab",
        "name": "",
        "active": false,
        "tosidebar": true,
        "console": false,
        "tostatus": false,
        "complete": "true",
        "targetType": "full",
        "x": 490,
        "y": 1320,
        "wires": []
    },
    {
        "id": "78becc08.a50a04",
        "type": "comment",
        "z": "540b412a.76eab",
        "name": "Arduino Mega",
        "info": "",
        "x": 90,
        "y": 1140,
        "wires": []
    },
    {
        "id": "7c4fffd0.1b5ac",
        "type": "comment",
        "z": "540b412a.76eab",
        "name": "Analog Pin 0",
        "info": "",
        "x": 90,
        "y": 1220,
        "wires": []
    },
    {
        "id": "a13bba7b.ee6258",
        "type": "arduino in",
        "z": "540b412a.76eab",
        "name": "",
        "pin": "1",
        "state": "ANALOG",
        "arduino": "9255cd05.df42a",
        "x": 90,
        "y": 1420,
        "wires": [
            [
                "1d95e24c.3557ae"
            ]
        ]
    },
    {
        "id": "b8f2d808.813738",
        "type": "debug",
        "z": "540b412a.76eab",
        "name": "",
        "active": false,
        "tosidebar": true,
        "console": false,
        "tostatus": false,
        "complete": "true",
        "targetType": "full",
        "x": 490,
        "y": 1420,
        "wires": []
    },
    {
        "id": "1d95e24c.3557ae",
        "type": "function",
        "z": "540b412a.76eab",
        "name": "To Centigrade",
        "func": "msg.payload = (msg.payload * 500)/1024\nreturn msg;",
        "outputs": 1,
        "noerr": 0,
        "x": 280,
        "y": 1420,
        "wires": [
            [
                "b8f2d808.813738",
                "1b85dd91.68c652",
                "d4fd0e25.dd89c"
            ]
        ]
    },
    {
        "id": "242c2ce3.ba7054",
        "type": "ui_gauge",
        "z": "540b412a.76eab",
        "name": "",
        "group": "5e74200e.55d4e",
        "order": 0,
        "width": 0,
        "height": 0,
        "gtype": "gage",
        "title": "Arduino A0- POT",
        "label": "Voltage",
        "format": "{{value|number:2}}",
        "min": 0,
        "max": 10,
        "colors": [
            "#00b500",
            "#e6e600",
            "#ca3838"
        ],
        "seg1": "",
        "seg2": "",
        "x": 530,
        "y": 1280,
        "wires": []
    },
    {
        "id": "9423aa16.bb1d38",
        "type": "range",
        "z": "540b412a.76eab",
        "minin": "0",
        "maxin": "1024",
        "minout": "0",
        "maxout": "10.0",
        "action": "scale",
        "round": false,
        "property": "payload",
        "name": "",
        "x": 300,
        "y": 1280,
        "wires": [
            [
                "242c2ce3.ba7054",
                "765fdb12.5b6fb4",
                "e235a26a.5a1c8"
            ]
        ]
    },
    {
        "id": "1b85dd91.68c652",
        "type": "ui_gauge",
        "z": "540b412a.76eab",
        "name": "",
        "group": "5e74200e.55d4e",
        "order": 0,
        "width": 0,
        "height": 0,
        "gtype": "gage",
        "title": "Room Temperature",
        "label": "Celcius",
        "format": "{{value|number:2}}",
        "min": 0,
        "max": "30",
        "colors": [
            "#33b0e6",
            "#f0b775",
            "#da6b10"
        ],
        "seg1": "",
        "seg2": "",
        "x": 530,
        "y": 1460,
        "wires": []
    },
    {
        "id": "a4f606f4.dde408",
        "type": "comment",
        "z": "540b412a.76eab",
        "name": "Analog Pin 1",
        "info": "",
        "x": 90,
        "y": 1360,
        "wires": []
    },
    {
        "id": "70d5a458.db4fec",
        "type": "arduino out",
        "z": "540b412a.76eab",
        "name": "",
        "pin": "2",
        "state": "OUTPUT",
        "arduino": "9255cd05.df42a",
        "x": 750,
        "y": 1040,
        "wires": []
    },
    {
        "id": "5b46d4fa.140e5c",
        "type": "comment",
        "z": "540b412a.76eab",
        "name": "Digital Pin 2",
        "info": "",
        "x": 90,
        "y": 1580,
        "wires": []
    },
    {
        "id": "6906c23d.6526ec",
        "type": "comment",
        "z": "540b412a.76eab",
        "name": "PWM Pin 3",
        "info": "",
        "x": 80,
        "y": 1740,
        "wires": []
    },
    {
        "id": "41bd7940.b3cd08",
        "type": "ui_button",
        "z": "540b412a.76eab",
        "name": "Turn ON",
        "group": "5e74200e.55d4e",
        "order": 2,
        "width": 0,
        "height": 0,
        "passthru": false,
        "label": "Turn ON",
        "tooltip": "",
        "color": "",
        "bgcolor": "Green",
        "icon": "",
        "payload": "1",
        "payloadType": "num",
        "topic": "",
        "x": 100,
        "y": 1640,
        "wires": [
            []
        ]
    },
    {
        "id": "72312a2d.614024",
        "type": "ui_button",
        "z": "540b412a.76eab",
        "name": "Turn OFF",
        "group": "5e74200e.55d4e",
        "order": 2,
        "width": 0,
        "height": 0,
        "passthru": false,
        "label": "Turn OFF",
        "tooltip": "",
        "color": "",
        "bgcolor": "red",
        "icon": "",
        "payload": "0",
        "payloadType": "num",
        "topic": "",
        "x": 100,
        "y": 1680,
        "wires": [
            []
        ]
    },
    {
        "id": "b0fe2201.8091f",
        "type": "ui_slider",
        "z": "540b412a.76eab",
        "name": "",
        "label": "Fading LED",
        "tooltip": "",
        "group": "5e74200e.55d4e",
        "order": 4,
        "width": 0,
        "height": 0,
        "passthru": true,
        "outs": "all",
        "topic": "",
        "min": "0",
        "max": "255",
        "step": 1,
        "x": 110,
        "y": 1780,
        "wires": [
            []
        ]
    },
    {
        "id": "6d8036d.f634ac8",
        "type": "arduino out",
        "z": "540b412a.76eab",
        "name": "",
        "pin": "3",
        "state": "PWM",
        "arduino": "9255cd05.df42a",
        "x": 790,
        "y": 1100,
        "wires": []
    },
    {
        "id": "cd0590f6.8ba36",
        "type": "comment",
        "z": "540b412a.76eab",
        "name": "From Arduino to OPC UA Server",
        "info": "",
        "x": 150,
        "y": 1180,
        "wires": []
    },
    {
        "id": "8a756e12.6b4d",
        "type": "comment",
        "z": "540b412a.76eab",
        "name": "From OPC UA Server to Arduino",
        "info": "",
        "x": 150,
        "y": 1540,
        "wires": []
    },
    {
        "id": "e235a26a.5a1c8",
        "type": "function",
        "z": "540b412a.76eab",
        "name": "To server",
        "func": "msg.topic = \"ns=1;s=Arduino.A0;datatype=Float\"\nreturn msg;",
        "outputs": 1,
        "noerr": 0,
        "x": 500,
        "y": 1360,
        "wires": [
            [
                "cc6ab4f9.ef5be8"
            ]
        ]
    },
    {
        "id": "cc6ab4f9.ef5be8",
        "type": "link out",
        "z": "540b412a.76eab",
        "name": "ArduinoA0",
        "links": [
            "c4b06178.08453"
        ],
        "x": 655,
        "y": 1360,
        "wires": []
    },
    {
        "id": "c4b06178.08453",
        "type": "link in",
        "z": "540b412a.76eab",
        "name": "",
        "links": [
            "cc6ab4f9.ef5be8",
            "cdfa3247.4bbf7"
        ],
        "x": 395,
        "y": 660,
        "wires": [
            [
                "754e3c74.a98e94",
                "47a11c2c.6807c4"
            ]
        ]
    },
    {
        "id": "47a11c2c.6807c4",
        "type": "debug",
        "z": "540b412a.76eab",
        "name": "",
        "active": false,
        "tosidebar": true,
        "console": false,
        "tostatus": false,
        "complete": "false",
        "x": 570,
        "y": 660,
        "wires": []
    },
    {
        "id": "d4fd0e25.dd89c",
        "type": "function",
        "z": "540b412a.76eab",
        "name": "To server",
        "func": "msg.topic = \"ns=1;s=Arduino.A1;datatype=Float\"\nreturn msg;",
        "outputs": 1,
        "noerr": 0,
        "x": 500,
        "y": 1500,
        "wires": [
            [
                "cdfa3247.4bbf7"
            ]
        ]
    },
    {
        "id": "cdfa3247.4bbf7",
        "type": "link out",
        "z": "540b412a.76eab",
        "name": "ArduinoA1",
        "links": [
            "c4b06178.08453"
        ],
        "x": 655,
        "y": 1500,
        "wires": []
    },
    {
        "id": "ff65d61d.3d8a18",
        "type": "inject",
        "z": "540b412a.76eab",
        "name": "Arduino Pin2",
        "topic": "ns=1;s=Arduino.Pin2;datatype=Boolean",
        "payload": "",
        "payloadType": "date",
        "repeat": "1",
        "crontab": "",
        "once": false,
        "onceDelay": 0.1,
        "x": 140,
        "y": 880,
        "wires": [
            [
                "1fb1d3d1.5ca9cc"
            ]
        ]
    },
    {
        "id": "2dcfb11c.2e9dbe",
        "type": "function",
        "z": "540b412a.76eab",
        "name": "Arduino PIn 2",
        "func": "if (msg.topic == \"ns=1;s=Arduino.Pin2\")\n{\n    if (msg.payload === true)\n   { msg.payload = 1;\n    return msg;}\n     if (msg.payload === false)\n   { msg.payload = 0;\n    return msg;}\n    \n}",
        "outputs": 1,
        "noerr": 0,
        "x": 560,
        "y": 980,
        "wires": [
            [
                "8e190388.1808c",
                "70d5a458.db4fec"
            ]
        ]
    },
    {
        "id": "8e190388.1808c",
        "type": "debug",
        "z": "540b412a.76eab",
        "name": "",
        "active": false,
        "tosidebar": true,
        "console": false,
        "tostatus": false,
        "complete": "false",
        "x": 770,
        "y": 980,
        "wires": []
    },
    {
        "id": "f165e078.8193f",
        "type": "inject",
        "z": "540b412a.76eab",
        "name": "Arduino Pin3",
        "topic": "ns=1;s=Arduino.Pin3;datatype=Int16",
        "payload": "",
        "payloadType": "date",
        "repeat": "1",
        "crontab": "",
        "once": false,
        "onceDelay": 0.1,
        "x": 140,
        "y": 920,
        "wires": [
            [
                "1fb1d3d1.5ca9cc"
            ]
        ]
    },
    {
        "id": "d0f36254.1c142",
        "type": "function",
        "z": "540b412a.76eab",
        "name": "Arduino PIn 2 (0:255)",
        "func": "if (msg.topic == \"ns=1;s=Arduino.Pin3\")\n{\n    return msg;\n    \n}",
        "outputs": 1,
        "noerr": 0,
        "x": 580,
        "y": 1100,
        "wires": [
            [
                "6d8036d.f634ac8",
                "46dcc809.3af468"
            ]
        ]
    },
    {
        "id": "46dcc809.3af468",
        "type": "debug",
        "z": "540b412a.76eab",
        "name": "",
        "active": true,
        "tosidebar": true,
        "console": false,
        "tostatus": false,
        "complete": "false",
        "x": 810,
        "y": 1160,
        "wires": []
    },
    {
        "id": "a6463b49.678438",
        "type": "OpcUa-Endpoint",
        "z": "",
        "endpoint": "opc.tcp://localhost:55380",
        "secpol": "None",
        "secmode": "None",
        "login": false
    },
    {
        "id": "7e10f4e5.f87c2c",
        "type": "modbus-client",
        "z": "",
        "name": "Delta PLC",
        "clienttype": "tcp",
        "bufferCommands": true,
        "stateLogEnabled": false,
        "queueLogEnabled": false,
        "tcpHost": "192.168.0.154",
        "tcpPort": "502",
        "tcpType": "DEFAULT",
        "serialPort": "/dev/ttyUSB",
        "serialType": "RTU-BUFFERD",
        "serialBaudrate": "9600",
        "serialDatabits": "8",
        "serialStopbits": "1",
        "serialParity": "none",
        "serialConnectionDelay": "100",
        "unit_id": "1",
        "commandDelay": "1",
        "clientTimeout": "1000",
        "reconnectOnTimeout": true,
        "reconnectTimeout": "2000",
        "parallelUnitIdsAllowed": true
    },
    {
        "id": "9255cd05.df42a",
        "type": "arduino-board",
        "z": "",
        "device": "COM7"
    },
    {
        "id": "5e74200e.55d4e",
        "type": "ui_group",
        "z": "",
        "name": "OPC UA Server",
        "tab": "6e9b9ef9.94e89",
        "order": 9,
        "disp": true,
        "width": "6",
        "collapse": false
    },
    {
        "id": "6e9b9ef9.94e89",
        "type": "ui_tab",
        "z": "",
        "name": "Home",
        "icon": "dashboard",
        "disabled": false,
        "hidden": false
    }
]