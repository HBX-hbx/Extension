import React from 'react'
import { ReactElement, useEffect, useState } from "react";
import './SetURLPrefixDialog.css'
import {useSelector} from "react-redux";
import {getTableDataState} from "../store/store";
import {
  List,
  ListItem,
  ListSubheader,
  ListItemIcon,
  ListItemText,
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControlLabel,
  Switch,
  IconButton,
  Typography
} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';

interface SetURLPrefixDialogProps {
  open: boolean; // 是否弹出
  onClose: () => void; // 关闭
  curTableIndex: number;
  tableData: any;
  onOK: (listened: boolean, listenedURLs: any) => void; // 用户更新后的 urls
}

export default function SetURLPrefixDialog (props: SetURLPrefixDialogProps) {

  const [url, setURL] = useState<string>('');
  const [auto, setAuto] = useState<boolean>(false);
  const [listenedURLs, setListenedURLs] = useState<string>('[]');
  const [urlItems, setUrlItems] = useState<ReactElement[]>([]);

  useEffect(() => {
    if (props.open) {
      setAuto(props.tableData[props.curTableIndex].listened);
      setListenedURLs(JSON.stringify(props.tableData[props.curTableIndex].listened_urls));
    }
  }, [props.open])

  useEffect(() => {
    if (listenedURLs) {
      setUrlItems(JSON.parse(listenedURLs).map((url: string, index: number) =>
        <ListItem
          key={url}
          id={url}
          disablePadding
          secondaryAction={
            <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(index)}>
              <DeleteIcon />
            </IconButton>
          }
        >
          <ListItemText primary={
            <React.Fragment>
              <Typography
                sx={{ display: 'inline-block', width: '100%'}}
                component="span"
                variant="body2"
                align="justify"
                noWrap
                color="text.primary"
              >
                {url}
              </Typography>
            </React.Fragment>
          } style={{paddingRight: '40px'}}/>
        </ListItem>
      ))
    }
  }, [listenedURLs])

  const handleOK = () => {
    props.onClose();
    props.onOK(auto, JSON.parse(listenedURLs));
  }

  const handleAdd = () => {
    let tmpListenedURLs = JSON.parse(listenedURLs);
    if (tmpListenedURLs.indexOf(url) !== -1 || url === '') {
      setURL('');
      return;
    }
    tmpListenedURLs.push(url);
    setURL('');
    setListenedURLs(JSON.stringify(tmpListenedURLs));
  }

  const handleDelete = (index: number) => {
    let tmpListenedURLs = JSON.parse(listenedURLs);
    tmpListenedURLs.splice(index, 1);
    setListenedURLs(JSON.stringify(tmpListenedURLs));
  }

  return (
    <div>
      <Dialog open={props.open} onClose={() => props.onClose()}>
        <DialogTitle>设置</DialogTitle>
        <DialogContent>
          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center'}}>
            <DialogContentText>
              开启自动获取
            </DialogContentText>
            <Switch
              edge="end"
              onChange={() => setAuto(!auto)}
              checked={auto}
              inputProps={{
                'aria-labelledby': 'switch-list-label-auto',
              }}
            />
          </div>
          <List
              sx={{ width: '100%', maxWidth: 300, bgcolor: 'background.paper' }}
              style={{ maxHeight: '100px', overflowY: "auto" }}
          >
            {urlItems}
          </List>
          <TextField
            autoFocus
            margin="dense"
            id="URLPrefix"
            label="添加自动获取地址"
            type="url"
            value={url}
            fullWidth
            variant="standard"
            onChange={(event) => setURL(event.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAdd}>添加</Button>
          <Button onClick={handleOK}>确定</Button>
          <Button onClick={() => props.onClose()}>取消</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
