import React, { useEffect,useRef, useMemo, useState } from 'react'
import { createEditor } from 'slate'
import { Slate, Editable, withReact } from 'slate-react'
import io from "socket.io-client";

const socket = io("http://localhost:4000");

export const SyncingEditor = (props) => {
    const [value, setValue] = useState([
      {
        type: 'paragraph',
        children: [{ text: 'A line of text in a paragraph.' }],
      } 
     ]); 
    const groupId = props.groupId;
    const editor = useMemo(() => withReact(createEditor()), [])
    const remote = useRef(null);
    const id = useRef(`${Date.now()}`)

    useEffect(() => {
      fetch(`http://localhost:4000/groups/${groupId}`).then(x =>
        x.json().then(data => {
          setValue(data);
        })
      );
      const eventName = `new-remote-operations-${groupId}`;
      socket.on(
        eventName,
        ( {editorId, ops } ) => {
            if (id.current !== editorId) {
              remote.current = true;
              ops.forEach((op) =>
                editor.apply(op)
              );
              remote.current = false;
            }
          }
        );

        return () => {
          socket.off(eventName);
        };

    }, [groupId])
    
  
    return (
      <Slate
      
        editor={editor}
        
        value={value}
        onChange={(opts) => {
            setValue(opts);
            const ops = editor.operations
                .filter(o => {
                    if (o) {
                    return (
                        o.type !== "set_selection" &&
                        o.type !== "set_value" &&
                        (!o.data )
                    );
                    }
                    console.log(o);
                    return false;
                })
                .map((o) => ({ ...o, data: { source: "one" } }));

            if (ops.length && !remote.current) {
                socket.emit("new-operations", {
                    editorId: id.current,
                    ops,
                    value : JSON.stringify(opts),
                    groupId
                  });
            } 
        }}
        
      >
        <Editable
        style={{
            backgroundColor: "#fafafa",
            maxWidth: 800,
            minHeight: 150
          }} />
      </Slate>
    )
}