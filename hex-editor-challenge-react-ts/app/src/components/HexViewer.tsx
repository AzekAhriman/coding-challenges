import React from 'react';

interface HexViewerProps {
  data: string | Uint8Array;
}

export default function HexViewer(props: HexViewerProps) {
  const lines: React.ReactElement[] = [];
  const BYTES_PER_LINE = 16;
  const toHex = (n: string | number, l: number) => typeof n === "string" ? Number(n.charCodeAt(0)).toString(16) : n.toString(16).padStart(l, '0');

  for (let offset = 0; offset < props.data.length; offset += 16) {
    const slice = [...props.data.slice(offset, offset + BYTES_PER_LINE)];
    const bytes =  slice.map((byte, i) => {
      return <span key={offset + i}>{toHex(byte, 2)}</span>
    });
    const bytesComponent = <div>{bytes}</div>;
    const asciiComponent = <span>|{
      slice.map(byte => {
        if(typeof byte === "string") {
          return byte;
        }
        if (byte >=0x20 && byte < 0x7f) {
          return String.fromCharCode(byte);
        }
        return '.';
      })
    }|</span>

    lines.push(<div>{bytesComponent} {asciiComponent}</div>)
  }

  return (
    <pre style={{ overflowWrap: 'break-word', whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
      Here comes the HexViewer<br />{ lines }
    </pre>
  );
}
