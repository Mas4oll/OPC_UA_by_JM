function constructAlarmAddressSpace(server, addressSpace, eventObjects, done) {
    // server = the created node-opcua server
    // addressSpace = script placeholder
    // eventObjects = to hold event variables in memory from this script
    
    // internal global sandbox objects are 
    // node = node of the flex server, 
    // coreServer = core iiot server object for debug and access to nodeOPCUA,
    // and scriptObjects to hold variables and functions
    const LocalizedText = coreServer.core.nodeOPCUA.LocalizedText
    const namespace = addressSpace.getOwnNamespace()

    coreServer.internalDebugLog('init dynamic address space')
    node.warn('construct new address space for OPC UA')
    
    // from here - see the node-opcua docs how to build address sapces
    let tanks = namespace.addObject({
        browseName: 'Tanks',
        description: 'The Object representing some tanks',
        organizedBy: addressSpace.rootFolder.objects,
        notifierOf: addressSpace.rootFolder.objects.server
    })
    
    let oilTankLevel = namespace.addVariable({
        browseName: 'OilTankLevel',
        displayName: [
          new LocalizedText({text: 'Oil Tank Level', locale: 'en-US'}),
          new LocalizedText({text: 'Öl Tank Füllstand', locale: 'de-DE'})
        ],
        description: 'Fill level in percentage (0% to 100%) of the oil tank',
        propertyOf: tanks,
        dataType: 'Double',
        eventSourceOf: tanks
    })
    
    // ---------------------------------------------------------------------------------
    // Let's create a exclusive Limit Alarm that automatically raise itself
    // when the tank level is out of limit
    // ---------------------------------------------------------------------------------
    let exclusiveLimitAlarmType = addressSpace.findEventType('ExclusiveLimitAlarmType')
    node.bianco.iiot.assert(exclusiveLimitAlarmType !== null)
    
    let oilTankLevelCondition = namespace.instantiateExclusiveLimitAlarm(exclusiveLimitAlarmType, {
        componentOf: tanks,
        conditionSource: oilTankLevel,
        browseName: 'OilTankLevelCondition',
        displayName: [
          new LocalizedText({text: 'Oil Tank Level Condition', locale: 'en-US'}),
          new LocalizedText({text: 'Öl Tank Füllstand Bedingung', locale: 'de-DE'})
        ],
        description: 'ExclusiveLimitAlarmType Condition',
        conditionName: 'OilLevelCondition',
        optionals: [
          'ConfirmedState', 'Confirm' // confirm state and confirm Method
        ],
        inputNode: oilTankLevel,   // the letiable that will be monitored for change
        highHighLimit: 0.9,
        highLimit: 0.8,
        lowLimit: 0.2
    })
    
    // --------------------------------------------------------------
    // Let's create a second letiable with no Exclusive alarm
    // --------------------------------------------------------------
    let gasTankLevel = namespace.addVariable({
        browseName: 'GasTankLevel',
        displayName: [
          new LocalizedText({text: 'Gas Tank Level', locale: 'en-US'}),
          new LocalizedText({text: 'Gas Tank Füllstand', locale: 'de-DE'})
        ],
        description: 'Fill level in percentage (0% to 100%) of the gas tank',
        propertyOf: tanks,
        dataType: 'Double',
        eventSourceOf: tanks
    })
    
    let nonExclusiveLimitAlarmType = addressSpace.findEventType('NonExclusiveLimitAlarmType')
    node.bianco.iiot.assert(nonExclusiveLimitAlarmType !== null)
    
    let gasTankLevelCondition = namespace.instantiateNonExclusiveLimitAlarm(nonExclusiveLimitAlarmType, {
        componentOf: tanks,
        conditionSource: gasTankLevel,
        browseName: 'GasTankLevelCondition',
        displayName: [
          new LocalizedText({text: 'Gas Tank Level Condition', locale: 'en-US'}),
          new LocalizedText({text: 'Gas Tank Füllstand Bedingung', locale: 'de-DE'})
        ],
        description: 'NonExclusiveLimitAlarmType Condition',
        conditionName: 'GasLevelCondition',
        optionals: [
          'ConfirmedState', 'Confirm' // confirm state and confirm Method
        ],
        inputNode: gasTankLevel,   // the letiable that will be monitored for change
        highHighLimit: 0.9,
        highLimit: 0.8,
        lowLimit: 0.2
    })
    
    
    // Initial conditions for Node-RED variables with value---------------------------------------------
    
    if(scriptObjects.Variable1 === undefined || scriptObjects.Variable1 === null) {
            scriptObjects.Variable1 = 0.0
    }
    
        if(scriptObjects.Variable2 === undefined || scriptObjects.Variable2 === null) {
            scriptObjects.Variable2 = null
    }
    
            if(scriptObjects.Variable3 === undefined || scriptObjects.Variable3 === null) {
            scriptObjects.Variable3 = false
    }
    
	    
    // Initial conditions for Delta PLC variables with value---------------------------------------------
    
    if(scriptObjects.D0 === undefined || scriptObjects.D0 === null) {
            scriptObjects.D0 = 0
	}
	if(scriptObjects.D1 === undefined || scriptObjects.D1 === null) {
            scriptObjects.D1 = 0
		}
		
	if(scriptObjects.M0 === undefined || scriptObjects.M0 === null) {
            scriptObjects.M0 = false
		}
		
	if(scriptObjects.Y0 === undefined || scriptObjects.Y0 === null) {
            scriptObjects.Y0 = false
		}
	
	
	    // Initial conditions for Arduino variables with value---------------------------------------------
    
    if(scriptObjects.A0 === undefined || scriptObjects.A0 === null) {
            scriptObjects.A0 = 0.0
	}
	if(scriptObjects.A1 === undefined || scriptObjects.A1 === null) {
            scriptObjects.A1 = 0.0
		}
		
	if(scriptObjects.Pin2 === undefined || scriptObjects.Pin2 === null) {
            scriptObjects.Pin2 = false
		}
		
	if(scriptObjects.Pin3 === undefined || scriptObjects.Pin3 === null) {
            scriptObjects.Pin3 = 0
		}
	
	
	
    //Creating objects in the OPC UA server------------------------------------------------
    
    let myVariable1 = namespace.addObject({
        browseName: 'Variables Node-Red',
        description: 'El objeto representa algunas variables',
        organizedBy: addressSpace.rootFolder.objects,
        notifierOf: addressSpace.rootFolder.objects.server
    })
    
	  let myVariable2 = namespace.addObject({
        browseName: 'Variables de PLC Delta',
        description: 'El objeto representa algunas variables',
        organizedBy: addressSpace.rootFolder.objects,
        notifierOf: addressSpace.rootFolder.objects.server
    })
    
	let myVariable3 = namespace.addObject({
        browseName: 'Variables de Arduino',
        description: 'El objeto representa algunas variables',
        organizedBy: addressSpace.rootFolder.objects,
        notifierOf: addressSpace.rootFolder.objects.server
    })
    
    
    
    // Defining tab properties for Node-RED variables-----------------------------
    
    if(coreServer.core) 
    {
        
        namespace.addVariable({
            componentOf: myVariable1,
            nodeId: 'ns=1;s=Variable1',
            browseName: 'Variable1',
            displayName: [
                new LocalizedText({text: 'Variable1', locale: 'en-US'}),
                new LocalizedText({text: 'Variable1', locale: 'de-DE'})
            ],
            dataType: 'Double',
            value: {
                get: function () {
                    return new coreServer.core.nodeOPCUA.Variant({
                        dataType: 'Double',
                        value: scriptObjects.Variable1
                    })
                },
                set: function (variant) {
                    scriptObjects.Variable1 = parseFloat(variant.value)
                    return coreServer.core.nodeOPCUA.StatusCodes.Good
                }
            }
            
        })
        
        namespace.addVariable({
            componentOf: myVariable1,
            nodeId: 'ns=1;s=Variable2',
            browseName: 'Variable2',
            displayName: [
                new LocalizedText({text: 'Variable2', locale: 'en-US'}),
                new LocalizedText({text: 'Variable2', locale: 'de-DE'})
            ],
            dataType: 'String',
            value: {
                get: function () {
                    return new coreServer.core.nodeOPCUA.Variant({
                        dataType: 'String',
                        value: scriptObjects.Variable2
                    })
                },
                set: function (variant) {
                    scriptObjects.Variable2 = parseFloat(variant.value)
                    return coreServer.core.nodeOPCUA.StatusCodes.Good
                }
            }
            
        })
        
           namespace.addVariable({
            componentOf: myVariable1,
            nodeId: 'ns=1;s=Variable3',
            browseName: 'Variable3',
            displayName: [
                new LocalizedText({text: 'Variable3', locale: 'en-US'}),
                new LocalizedText({text: 'Variable3', locale: 'de-DE'})
            ],
            dataType: 'Boolean',
            value: {
                get: function () {
                    return new coreServer.core.nodeOPCUA.Variant({
                        dataType: 'Boolean',
                        value: scriptObjects.Variable3
                    })
                },
                set: function (variant) {
                    scriptObjects.Variable3 = variant.value
                    return coreServer.core.nodeOPCUA.StatusCodes.Good
                }
            }
            
        })
        
		
		// Delta PLC variables
		
		      namespace.addVariable({
            componentOf: myVariable2,
            nodeId: 'ns=1;s=Delta.D0',
            browseName: 'Delta.D0',
            displayName: [
                new LocalizedText({text: 'Delta.D0', locale: 'en-US'}),
                new LocalizedText({text: 'Delta.D0', locale: 'de-DE'})
            ],
            dataType: 'Int16',
            value: {
                get: function () {
                    return new coreServer.core.nodeOPCUA.Variant({
                        dataType: 'Int16',
                        value: scriptObjects.D0
                    })
                },
                set: function (variant) {
                    scriptObjects.D0 = variant.value
                    return coreServer.core.nodeOPCUA.StatusCodes.Good
                }
            }
            
        })
		

		
		      namespace.addVariable({
            componentOf: myVariable2,
            nodeId: 'ns=1;s=Delta.D1',
            browseName: 'Delta.D1',
            displayName: [
                new LocalizedText({text: 'Delta.D1', locale: 'en-US'}),
                new LocalizedText({text: 'Delta.D1', locale: 'de-DE'})
            ],
            dataType: 'Int16',
            value: {
                get: function () {
                    return new coreServer.core.nodeOPCUA.Variant({
                        dataType: 'Int16',
                        value: scriptObjects.D1
                    })
                },
                set: function (variant) {
                    scriptObjects.D1 = variant.value
                    return coreServer.core.nodeOPCUA.StatusCodes.Good
                }
            }
            
        })
        
        
        	      namespace.addVariable({
            componentOf: myVariable2,
            nodeId: 'ns=1;s=Delta.M0',
            browseName: 'Delta.M0',
            displayName: [
                new LocalizedText({text: 'Delta.M0', locale: 'en-US'}),
                new LocalizedText({text: 'Delta.M0', locale: 'de-DE'})
            ],
            dataType: 'Boolean',
            value: {
                get: function () {
                    return new coreServer.core.nodeOPCUA.Variant({
                        dataType: 'Boolean',
                        value: scriptObjects.M0
                    })
                },
                set: function (variant) {
                    scriptObjects.M0 = variant.value
                    return coreServer.core.nodeOPCUA.StatusCodes.Good
                }
            }
            
        })
		
		     	      namespace.addVariable({
            componentOf: myVariable2,
            nodeId: 'ns=1;s=Delta.Y0',
            browseName: 'Delta.Y0',
            displayName: [
                new LocalizedText({text: 'Delta.Y0', locale: 'en-US'}),
                new LocalizedText({text: 'Delta.Y0', locale: 'de-DE'})
            ],
            dataType: 'Boolean',
            value: {
                get: function () {
                    return new coreServer.core.nodeOPCUA.Variant({
                        dataType: 'Boolean',
                        value: scriptObjects.Y0
                    })
                },
                set: function (variant) {
                    scriptObjects.Y0 = variant.value
                    return coreServer.core.nodeOPCUA.StatusCodes.Good
                }
            }
            
        })
		
		
		//Arduino variables definitions
		
		namespace.addVariable({
            componentOf: myVariable3,
            nodeId: 'ns=1;s=Arduino.A0',
            browseName: 'Arduino.A0',
            displayName: [
                new LocalizedText({text: 'Arduino.A0', locale: 'en-US'}),
                new LocalizedText({text: 'Arduino.A0', locale: 'de-DE'})
            ],
            dataType: 'Float',
            value: {
                get: function () {
                    return new coreServer.core.nodeOPCUA.Variant({
                        dataType: 'Float',
                        value: scriptObjects.A0
                    })
                },
                set: function (variant) {
                    scriptObjects.A0 = parseFloat(variant.value)
                    return coreServer.core.nodeOPCUA.StatusCodes.Good
                }
            }
            
        })
		
			namespace.addVariable({
            componentOf: myVariable3,
            nodeId: 'ns=1;s=Arduino.A1',
            browseName: 'Arduino.A1',
            displayName: [
                new LocalizedText({text: 'Arduino.A1', locale: 'en-US'}),
                new LocalizedText({text: 'Arduino.A1', locale: 'de-DE'})
            ],
            dataType: 'Float',
            value: {
                get: function () {
                    return new coreServer.core.nodeOPCUA.Variant({
                        dataType: 'Float',
                        value: scriptObjects.A1
                    })
                },
                set: function (variant) {
                    scriptObjects.A1 = parseFloat(variant.value)
                    return coreServer.core.nodeOPCUA.StatusCodes.Good
                }
            }
            
        })
		
		
		namespace.addVariable({
            componentOf: myVariable3,
            nodeId: 'ns=1;s=Arduino.Pin2',
            browseName: 'Arduino.Pin2',
            displayName: [
                new LocalizedText({text: 'Arduino.Pin2', locale: 'en-US'}),
                new LocalizedText({text: 'Arduino.Pin2', locale: 'de-DE'})
            ],
            dataType: 'Boolean',
            value: {
                get: function () {
                    return new coreServer.core.nodeOPCUA.Variant({
                        dataType: 'Boolean',
                        value: scriptObjects.Pin2
                    })
                },
                set: function (variant) {
                    scriptObjects.Pin2 = variant.value
                    return coreServer.core.nodeOPCUA.StatusCodes.Good
                }
            }
            
        })
		
		namespace.addVariable({
            componentOf: myVariable3,
            nodeId: 'ns=1;s=Arduino.Pin3',
            browseName: 'Arduino.Pin3',
            displayName: [
                new LocalizedText({text: 'Arduino.Pin3', locale: 'en-US'}),
                new LocalizedText({text: 'Arduino.Pin3', locale: 'de-DE'})
            ],
            dataType: 'Int16',
            value: {
                get: function () {
                    return new coreServer.core.nodeOPCUA.Variant({
                        dataType: 'Int16',
                        value: scriptObjects.Pin3
                    })
                },
                set: function (variant) {
                    scriptObjects.Pin3 = variant.value
                    return coreServer.core.nodeOPCUA.StatusCodes.Good
                }
            }
            
        })
		
		
		
		
        
        
        let memoryVariable = namespace.addVariable({
            componentOf: myVariable1,
            nodeId: 'ns=1;s=free_memory',
            browseName: 'FreeMemory',
            displayName: [
                new LocalizedText({text: 'Free Memory', locale: 'en-US'}),
                new LocalizedText({text: 'Memoria libre', locale: 'de-DE'})
            ],
            dataType: 'Double',
            
            value: {
              get: function () {
                return new coreServer.core.nodeOPCUA.Variant({
                  dataType: 'Double',
                  value: coreServer.core.availableMemory()
                })
              }
            }
        })
        addressSpace.installHistoricalDataNode(memoryVariable)
       
    } else {
        coreServer.internalDebugLog('coreServer.core needed for coreServer.core.nodeOPCUA')
    }

    // hold event objects in memory 
    eventObjects.oilTankLevel = oilTankLevel
    eventObjects.oilTankLevelCondition = oilTankLevelCondition
    
    eventObjects.gasTankLevel = gasTankLevel
    eventObjects.gasTankLevelCondition = gasTankLevelCondition
    
    done()
}