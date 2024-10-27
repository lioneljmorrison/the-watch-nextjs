import { db } from '@/lib/firebase/firebase';
import { Companies, Company, DeviceChangeReport, DeviceImport, DevicesImport } from '../../../pages/api/v1/interfaces';
import { CollectionReference, DocumentData, DocumentReference, Timestamp, WriteResult } from 'firebase-admin/firestore';
import { Devices, StatusLog } from '../../../pages/api/v1/deviceInterfaces';

export class Firestore {
  static getCompanyRef(accountId: string): DocumentReference {
    return db.collection('company').doc(accountId);
  }

  static async getCompanySnapshot(accountId: string): Promise<DocumentData> {
    const companyRef = this.getCompanyRef(accountId);
    return await companyRef.get();
  }

  static async getCompanyDetails(accountId: string): Promise<Company> {
    const companyData = (await this.getCompanySnapshot(accountId)).data() as Company;

    return {
      name: companyData.name,
      joined: (companyData.joined as Timestamp).toDate().toString(),
      enabled: companyData.enabled,
    };
  }

  static async getCompanies(): Promise<Companies> {
    const companyRef = db.collection('company'),
      companySnapshot = await companyRef.get(),
      companies: Companies = {};

    companySnapshot.docs.forEach((doc) => {
      companies[doc.id] = {
        name: doc.data().name,
        joined: doc.data().joined.toDate(),
        enabled: doc.data().enabled,
      };
    });

    return companies;
  }

  static getDeviceRef(accountId: string, deviceId: string): DocumentReference {
    const companyRef = this.getCompanyRef(accountId),
      deviceRef = companyRef.collection('devices').doc(deviceId);
    return deviceRef;
  }

  static getDeviceCollection(accountId: string): CollectionReference {
    const companyRef = this.getCompanyRef(accountId),
      deviceRef = companyRef.collection('devices');
    return deviceRef;
  }

  static getDeviceStatusCollectionRef(accountId: string, deviceId: string, statusId: string): DocumentReference {
    const deviceRef = this.getDeviceRef(accountId, deviceId),
      statusRef = deviceRef.collection('status').doc(statusId);
    return statusRef;
  }
  static getDeviceStatusCollection(accountId: string, deviceId: string): CollectionReference {
    const deviceRef = this.getDeviceRef(accountId, deviceId),
      statusRef = deviceRef.collection('status');
    return statusRef;
  }

  static async addCompany(info: Company): Promise<WriteResult> {
    const data = { ...info };

    delete data.id;

    return await db
      .collection('company')
      .doc(info.id as string)
      .set(data);
  }

  static async addDevice(accountId: string, deviceId: string, deviceInfo: DeviceImport): Promise<WriteResult> {
    const deviceRef = await this.getDeviceRef(accountId, deviceId);
    return deviceRef.set(deviceInfo);
  }

  static addDevicesBulk(accountId: string, deviceInfo: DevicesImport) {
    Object.entries(deviceInfo).forEach((deviceInfo, index) => {
      const [deviceId, data] = [...deviceInfo];
      this.addDevice(accountId, deviceId, data);
    });
  }

  static async getDevices(accountId: string): Promise<Devices> {
    const devicesRef = this.getDeviceCollection(accountId),
      status = await devicesRef.get(),
      result: Devices = {};

    status.forEach((doc) => {
      result[doc.id] = {
        deviceName: doc.data().deviceName,
        deviceType: doc.data().deviceType,
        hubDeviceId: doc.data().hubDeviceId,
      };
    });

    return result;
  }

  static async getDeviceStatus(accountId: string, deviceId: string, statusId: string): Promise<unknown> {
    const devicesRef = this.getDeviceStatusCollectionRef(accountId, deviceId, statusId),
      status = (await devicesRef.get()).data();

    return status;
  }

  static async getDeviceStatuses(accountId: string, deviceId: string) {
    const devicesRef = this.getDeviceStatusCollection(accountId, deviceId),
      status = await devicesRef.get(),
      result: StatusLog = {};

    status.forEach((doc) => {
      result[doc.id] = {
        humidity: doc.data().humidity,
        temperature: doc.data().temperature,
        timeOfSample: doc.data().timeOfSample,
      };
    });

    return result;
  }

  static async addDeviceStatus(accountId: string, deviceId: string, status: DeviceChangeReport): Promise<WriteResult> {
    const deviceRef = this.getDeviceStatusCollection(accountId, deviceId);
    return deviceRef.doc().set(status);
  }
}
