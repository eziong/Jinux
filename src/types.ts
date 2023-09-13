export type SystemContextProps = {
    inodes: Inode[];
    dataBlocks: DataBlock[];
    doCommand: (path:string, args: string[]) => void;
    initSystemSettings: () => void;
    mkdir: (parentInodeId: number, fileName: string) => void;
    touch: (parentInodeId: number, fileName: string) => void;
    findChildrenEntry: (inode_id:number) => null | DirectoryEntry[],
}

export type TerminalContextProps = {
    paths: string[];
    histories: string[];
    currentDirectory: DirectoryEntry;
    addHistory: (path:string, command: string) => void;
    cd: (dirName:string) => void;
    initTerminal: () => void;
}

export enum FileType {
    NORMAL = '-',
    DIRECTORY = 'd',
    BLOCK_DEVICE = 'b',
    CHARACTER_DEVICE = 'c',
    PIPE = 'p',
    SOCKET = 's',
    SYMBOLIC = 'l'
}

export type Inode = {
    id: number;
    file_type: FileType;
    block_size: number;
    blocks: number[];
}

export type DataBlock = {
    block_position: number;
    directory_entry: DirectoryEntry[]; // 디렉터티일 경우, 하위 
}

export type DirectoryEntry = {
    inode_id: number;
    file_name: string;
}