export class DataService {
  private selectedFamilyKey = "selectedFamilyId";
  private membersKey = "members";

  // ===============================
  // FAMILY
  // ===============================

  setSelectedFamily(id: number) {
    localStorage.setItem(this.selectedFamilyKey, id.toString());
  }

  getSelectedFamily(): number | null {
    const value = localStorage.getItem(this.selectedFamilyKey);
    return value ? Number(value) : null;
  }

  clearSelectedFamily() {
    localStorage.removeItem(this.selectedFamilyKey);
  }

  // ===============================
  // MEMBERS
  // ===============================

  setMembers(members: any[]) {
    localStorage.setItem(this.membersKey, JSON.stringify(members));
  }

  getMembers(): any[] {
    const value = localStorage.getItem(this.membersKey);
    return value ? JSON.parse(value) : [];
  }

  clearMembers() {
    localStorage.removeItem(this.membersKey);
  }

  clearAll() {
    localStorage.removeItem(this.selectedFamilyKey);
    localStorage.removeItem(this.membersKey);
  }
}

export const dataService = new DataService();